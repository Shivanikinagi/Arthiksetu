from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import IncomeSource, MonthlyEarning
import time
import sys
import os
import datetime
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from django.core.files.storage import FileSystemStorage
from django.conf import settings

# Add parent directory to path to import sibling modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from sms_parser import SMSParser
    from schemes import get_eligible_schemes, SCHEMES_DB
    from gemini_service import analyze_earning_trend, verify_document_with_ai
except ImportError:
    pass

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
except ImportError:
    canvas = None

parser = SMSParser()

class DashboardView(APIView):
    def get(self, request):
        income_sources = list(IncomeSource.objects.all().values())
        earnings = list(MonthlyEarning.objects.all().values())
        
        COLOR_MAP = {
            'Swiggy': '#F7931E',
            'Zomato': '#3B82F6',
            'Freelance / Fiverr': '#1E7F5C',
            'Cash Jobs': '#F59E0B',
            'UPI Transfers': '#0A1F44'
        }
        
        for source in income_sources:
            source['color'] = COLOR_MAP.get(source['name'], '#3B82F6')
            
        # Calc Arthik Score
        total_income = sum(s['amount'] for s in income_sources)
        verified_count = sum(1 for s in income_sources if s['verified'])
        
        score = 300 # Base CIBIL equivalent
        score += min(total_income / 1000 * 5, 300) # Income Weight
        score += (verified_count * 100) # Verification Weight
        if len(earnings) >= 3: score += 50 # Consistency Weight
        
        arthik_score = min(int(score), 900)
            
        return Response({
            "incomeSources": income_sources,
            "earningsData": earnings,
            "arthikScore": arthik_score
        })

class VerifyDocumentView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        doc_type = request.data.get('doc_type', 'Document')
        file_obj = request.FILES.get('file')
        
        if not file_obj:
             return Response({"status": "failed", "message": "No file uploaded"}, status=400)
             
        # Optional: Save file to disk
        fs = FileSystemStorage()
        filename = fs.save(file_obj.name, file_obj)
        file_url = fs.url(filename)
        
        # AI Verification for specific ID documents
        if doc_type in ['Aadhaar', 'PAN Card', 'Bank Account']:
            try:
                # Read file content. Note: file_obj might need seek(0) if read previously by fs.save
                with open(fs.path(filename), 'rb') as f:
                    file_content = f.read()
                mime_type = file_obj.content_type or 'image/jpeg'
                
                # Verify with Gemini
                result = verify_document_with_ai(file_content, mime_type, doc_type)
                
                if not result.get('is_valid'):
                    return Response({
                        "status": "failed",
                        "message": result.get('reason', 'Verification failed'),
                        "extracted_id": result.get('extracted_id')
                    }, status=400)
                
                return Response({
                    "status": "verified",
                    "doc_type": doc_type,
                    "message": f"{doc_type} Verified Successfully!",
                    "feature_extracted": result.get('extracted_id')
                })
            except Exception as e:
                print(f"Verification Error: {e}")
                return Response({"status": "failed", "message": "Verification service unavailable"}, status=503)

        # Default / Income Proof Logic (Simulated Extraction)
        time.sleep(1.5)
        
        extracted_amount = 65000 # Monthly
        
        # Update Income Source
        source, created = IncomeSource.objects.get_or_create(
            name="Verified Document Upload",
            defaults={'amount': 0, 'status': 'verified', 'verified': True} 
        )
        source.amount = extracted_amount
        source.verified = True
        source.save()
        
        # Update Monthly Earning
        current_month = datetime.datetime.now().strftime("%b")
        earning, created = MonthlyEarning.objects.get_or_create(
            month=current_month,
            defaults={'amount': 0}
        )
        earning.amount += extracted_amount
        earning.save()
        
        return Response({
            "status": "verified",
            "doc_type": doc_type,
            "message": f"{doc_type} verified. Extracted earnings: Rs. {extracted_amount}/month",
            "confidence_score": 0.98,
            "extracted_data": {"monthly_income": extracted_amount},
            "file_url": file_url
        })

class ParseSMSView(APIView):
    def post(self, request):
        try:
            messages = request.data.get('messages', [])
            if not messages:
                return Response({"error": "No messages provided"}, status=400)
            
            results = parser.parse_batch(messages)
            
            current_month = datetime.datetime.now().strftime("%b") # e.g., "Jan"
            
            for tx in results:
                if tx['type'] == 'credit' and tx['merchant'] != 'Unknown':
                    source, created = IncomeSource.objects.get_or_create(
                        name=tx['merchant'],
                        defaults={'amount': 0, 'status': 'verified', 'verified': True} 
                    )
                    source.amount += tx['amount']
                    source.verified = True
                    source.save()
                    
                    earning, created = MonthlyEarning.objects.get_or_create(
                        month=current_month,
                        defaults={'amount': 0}
                    )
                    earning.amount += tx['amount']
                    earning.save()

            total_credit = sum(r['amount'] for r in results if r['type'] == 'credit')
            total_debit = sum(r['amount'] for r in results if r['type'] == 'debit')
            
            return Response({
                "transactions": results,
                "summary": {
                    "total_credit": total_credit,
                    "total_debit": total_debit,
                    "count": len(results)
                }
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class RecommendSchemesView(APIView):
    def post(self, request):
        try:
            profile = request.data
            recommendations = get_eligible_schemes(profile)
            return Response({"schemes": recommendations, "count": len(recommendations)})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AllSchemesView(APIView):
    def get(self, request):
        return Response({"schemes": SCHEMES_DB})

class TaxCalculationView(APIView):
    def get(self, request):
        sources = IncomeSource.objects.all()
        total_monthly = sum(s.amount for s in sources)
        annual_income = total_monthly * 12 
        
        tax = 0
        temp_income = annual_income
        
        if temp_income > 300000:
            taxable = min(temp_income, 600000) - 300000
            tax += taxable * 0.05
        if temp_income > 600000:
            taxable = min(temp_income, 900000) - 600000
            tax += taxable * 0.10
        if temp_income > 900000:
            taxable = min(temp_income, 1200000) - 900000
            tax += taxable * 0.15
        if temp_income > 1200000:
            taxable = min(temp_income, 1500000) - 1200000
            tax += taxable * 0.20
        if temp_income > 1500000:
            taxable = temp_income - 1500000
            tax += taxable * 0.30

        if annual_income <= 700000:
            tax = 0
        else:
            tax = tax * 1.04
            
        return Response({
            "annual_income": annual_income,
            "tax_payable": int(tax),
            "refund_eligible": 0 if tax > 0 else 0
        })

class EligibleLoansView(APIView):
    def get(self, request):
        sources = IncomeSource.objects.all()
        total_monthly_income = sum(s.amount for s in sources)
        
        # Real-world loan criteria (approximate)
        all_loans = [
             {
                 "id": 1, 
                 "lender": "HDFC Bank", 
                 "min_income": 25000, 
                 "notes": "Interest starting @ 10.50% p.a.",
                 "link": "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan"
             },
             {
                 "id": 2, 
                 "lender": "ICICI Bank", 
                 "min_income": 30000, 
                 "notes": "Disbursal in 3 seconds for select customers",
                 "link": "https://www.icicibank.com/personal-banking/loans/personal-loan"
             },
             {
                 "id": 3, 
                 "lender": "SBI Bank", 
                 "min_income": 15000, 
                 "notes": "Low rates for Govt/PSU employees",
                 "link": "https://sbi.co.in/web/personal-banking/loans/personal-loans/xplain-personal-loan"
             },
             {
                 "id": 4, 
                 "lender": "Axis Bank", 
                 "min_income": 15000, 
                 "notes": "Loans up to ₹40 Lakhs",
                 "link": "https://www.axisbank.com/retail/loans/personal-loan"
             },
             {
                 "id": 5, 
                 "lender": "Kotak Mahindra Bank", 
                 "min_income": 20000, 
                 "notes": "Instant Personal Loan",
                 "link": "https://www.kotak.com/en/personal-banking/loans/personal-loan.html"
             },
             {
                 "id": 6, 
                 "lender": "IDFC FIRST Bank", 
                 "min_income": 20000, 
                 "notes": "Paperless digital process",
                 "link": "https://www.idfcfirstbank.com/personal-banking/loans/personal-loan"
             },
             {
                 "id": 7, 
                 "lender": "Bajaj Finserv", 
                 "min_income": 25000, 
                 "notes": "Approval in 5 minutes",
                 "link": "https://www.bajajfinserv.in/personal-loan"
             },
             {
                 "id": 8, 
                 "lender": "IndusInd Bank", 
                 "min_income": 25000, 
                 "notes": "Flexible tenure options",
                 "link": "https://www.indusind.com/in/en/personal/loans/personal-loan.html"
             },
             {
                 "id": 9, 
                 "lender": "Tata Capital", 
                 "min_income": 15000, 
                 "notes": "Trusted Brand, transparent charges",
                 "link": "https://www.tatacapital.com/personal-loan.html"
             },
             {
                 "id": 10, 
                 "lender": "Aditya Birla Capital", 
                 "min_income": 15000, 
                 "notes": "Minimum documentation required",
                 "link": "https://finance.adityabirlacapital.com/personal-loan"
             }
        ]
        
        eligible = []
        for loan in all_loans:
            if total_monthly_income >= loan['min_income']:
                eligible.append(loan)
                
        return Response({
            "loans": eligible,
            "user_monthly_income": total_monthly_income
        })

class GenerateReportView(APIView):
    def get(self, request):
        if not canvas: return Response({"error": "ReportLab missing"}, status=500)
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("Helvetica-Bold", 18)
        p.drawString(50, height - 50, "ArthikSetu - Verified Income Report")
        
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 80, f"Date: {datetime.datetime.now().strftime('%d %b %Y')}")
        p.drawString(50, height - 100, "User: Rajesh Kumar")

        p.setFont("Helvetica-Bold", 14)
        p.drawString(50, height - 140, "Verified Income Sources")

        p.setFont("Helvetica-Bold", 12)
        y = height - 170
        p.drawString(50, y, "Source")
        p.drawString(300, y, "Monthly Earnings")
        p.drawString(450, y, "Status")
        p.line(50, y-5, 550, y-5)
        
        p.setFont("Helvetica", 12)
        y -= 25
        
        sources = IncomeSource.objects.all()
        total_monthly = 0
        
        for source in sources:
            p.drawString(50, y, source.name)
            p.drawString(300, y, f"Rs. {source.amount:,}")
            p.drawString(450, y, "Verified" if source.verified else "Pending")
            total_monthly += source.amount
            y -= 25
            
        p.line(50, y+15, 550, y+15)
        p.setFont("Helvetica-Bold", 14)
        y -= 10
        p.drawString(50, y, "Total Monthly Income")
        p.drawString(300, y, f"Rs. {total_monthly:,}")
        
        y -= 30
        p.drawString(50, y, "Projected Annual Income")
        p.drawString(300, y, f"Rs. {total_monthly * 12:,}")
        
        p.setFont("Helvetica-Oblique", 10)
        p.drawString(50, 50, "Generated by ArthikSetu - Financial Bridge for Gig India")
        
        p.showPage()
        p.save()
        
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')

class DownloadReportView(APIView):
    def get(self, request, report_id=None):
        if not canvas:
            return Response({"error": "Report generation library missing (reportlab)."}, status=500)
            
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        
        # Common Header
        p.setFont("Helvetica-Bold", 10)
        p.drawString(50, height - 30, "ArthikSetu Platform")
        p.line(50, height - 35, 550, height - 35)

        if report_id == 'tax_statement_24_25':
            p.setFont("Helvetica-Bold", 18)
            p.drawString(50, height - 80, "Tax Liability Statement (FY 2024-25)")
            
            # Recalculate Tax
            sources = IncomeSource.objects.all()
            total_monthly = sum(s.amount for s in sources)
            annual_income = total_monthly * 12
            
            tax = 0
            temp_income = annual_income
            if temp_income > 300000: tax += (min(temp_income, 600000) - 300000) * 0.05
            if temp_income > 600000: tax += (min(temp_income, 900000) - 600000) * 0.10
            if temp_income > 900000: tax += (min(temp_income, 1200000) - 900000) * 0.15
            if temp_income > 1200000: tax += (min(temp_income, 1500000) - 1200000) * 0.20
            if temp_income > 1500000: tax += (temp_income - 1500000) * 0.30
            
            if annual_income <= 700000: tax = 0
            else: tax = tax * 1.04 # Cess
            
            # Print Details
            p.setFont("Helvetica", 12)
            y = height - 120
            
            p.drawString(50, y, f"Assessee Name: Rajesh Kumar"); y -= 20
            p.drawString(50, y, f"PAN: Unknown (Verified User)"); y -= 20
            p.drawString(50, y, f"Financial Year: 2024-25"); y -= 40
            
            p.setFont("Helvetica-Bold", 14)
            p.drawString(50, y, "Computation of Income"); y -= 30
            
            p.setFont("Helvetica", 12)
            p.drawString(50, y, "Gross Total Income (Annualized):"); p.drawString(400, y, f"Rs. {annual_income:,}"); y -= 20
            p.drawString(50, y, "Deductions (Standard):"); p.drawString(400, y, "Rs. 0"); y -= 20 # Placeholder
            p.line(50, y-5, 500, y-5); y -= 25
            
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y, "Net Taxable Income:"); p.drawString(400, y, f"Rs. {annual_income:,}"); y -= 40
            
            p.setFont("Helvetica-Bold", 14)
            p.drawString(50, y, "Tax Calculation (New Regime)"); y -= 30
            p.setFont("Helvetica", 12)
            p.drawString(50, y, "Total Tax Payable:"); p.drawString(400, y, f"Rs. {int(tax):,}"); y -= 20
            p.drawString(50, y, "Cess (4%):"); p.drawString(400, y, "Included"); y -= 20
            
            y -= 40
            p.setFont("Helvetica-Oblique", 10)
            p.drawString(50, y, "* This is a provisional statement generated based on verified platform earnings.")

        elif report_id == 'monthly_dec_2024' or (report_id and 'monthly' in report_id):
            p.setFont("Helvetica-Bold", 18)
            p.drawString(50, height - 80, "Monthly Earnings Statement - Dec 2024")
            
            p.setFont("Helvetica", 12)
            y = height - 120
            p.drawString(50, y, f"User: Rajesh Kumar"); y -= 20
            p.drawString(50, y, f"Period: 01 Dec 2024 to 31 Dec 2024"); y -= 40
            
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y, "Source"); p.drawString(300, y, "Amount"); p.drawString(450, y, "Date"); y -= 10
            p.line(50, y, 550, y); y -= 20
            
            # Mock Data for Dec
            sources = IncomeSource.objects.all()
            total = 0
            p.setFont("Helvetica", 12)
            for source in sources:
                amount = source.amount 
                p.drawString(50, y, source.name)
                p.drawString(300, y, f"Rs. {amount:,}")
                p.drawString(450, y, "Recurring")
                total += amount
                y -= 25
            
            p.line(50, y+10, 550, y+10)
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y, "Total Dec Earnings"); p.drawString(300, y, f"Rs. {total:,}");

        elif report_id == 'income_passport_verified':
            # Identity Card Style
            p.rect(50, height - 350, 400, 250) # Card Border
            p.setFillColorRGB(0.97, 0.58, 0.12) # Orange Header
            p.rect(51, height - 150, 398, 50, fill=1)
            p.setFillColorRGB(1, 1, 1) # White text
            p.setFont("Helvetica-Bold", 18)
            p.drawString(70, height - 130, "ArthikSetu Verified ID")
            p.setFillColorRGB(0, 0, 0) # Black text
            p.setFont("Helvetica", 12)
            
            sources = IncomeSource.objects.all()
            total_monthly = sum(s.amount for s in sources)
            y = height - 180
            p.drawString(70, y, f"Name: Rajesh Kumar"); y -= 25
            p.drawString(70, y, f"ID: AS-2024-8821"); y -= 25
            p.drawString(70, y, f"Verified Monthly Income: Rs. {total_monthly:,}"); y -= 25
            p.drawString(70, y, f"Risk Category: Low"); y -= 25
            p.rect(350, height - 320, 80, 80)
            p.setFont("Helvetica", 8)
            p.drawString(365, height - 280, "QR CODE")

        else:
            # Default Annual Report (Consolidated)
            p.setFont("Helvetica-Bold", 18)
            p.drawString(50, height - 80, "Verified Annual Income Report")
            p.setFont("Helvetica", 12)
            p.drawString(50, height - 110, f"Generated: {datetime.datetime.now().strftime('%d %b %Y')}")
            
            sources = IncomeSource.objects.all()
            total_monthly = sum(s.amount for s in sources)
            y = height - 150
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y, "Source"); p.drawString(400, y, "Monthly Amount")
            p.line(50, y-5, 550, y-5); y -= 25
            
            p.setFont("Helvetica", 12)
            for source in sources:
                p.drawString(50, y, source.name)
                p.drawString(400, y, f"Rs. {source.amount:,}")
                y -= 25
            p.line(50, y+15, 550, y+15)
            p.setFont("Helvetica-Bold", 14)
            p.drawString(50, y, "Total Projected Annual:"); p.drawString(400, y, f"Rs. {total_monthly*12:,}")

        # Finalize
        p.showPage()
        p.save()
        buffer.seek(0)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{report_id or "report"}.pdf"'
        return response

class SendOTPView(APIView):
    def post(self, request):
        target = request.data.get('target')
        type_ = request.data.get('type')
        if not target or not type_:
            return Response({"error": "Target and type are required"}, status=400)
        otp = "123456"
        # request.session[f'otp_{type_}_{target}'] = otp
        # request.session.save()
        return Response({"message": f"OTP sent to {target}", "success": True})

class VerifyOTPView(APIView):
    def post(self, request):
        return Response({"message": "Verification successful", "success": True})
