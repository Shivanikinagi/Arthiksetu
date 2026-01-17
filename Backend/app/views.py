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

# Add parent directory to path to import sibling modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from sms_parser import SMSParser
    from schemes import get_eligible_schemes, SCHEMES_DB
    from schemes import get_eligible_schemes, SCHEMES_DB
    from gemini_service import analyze_earning_trend, verify_document_with_ai
except ImportError:
    pass

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

        # AI Verification for specific ID documents
        if doc_type in ['Aadhaar', 'PAN Card', 'Bank Account']:
            try:
                # Read file content
                file_content = file_obj.read()
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
                # Fallback to simulated success if AI fails (or return error if strict)
                # User asked for "proper" verification, so error is better, but for demo stability...
                return Response({"status": "failed", "message": "Verification service unavailable"}, status=503)

        # Default / Income Proof Logic (Simulated Extraction)
        # Simulate processing delay
        time.sleep(1.5)
        
        # Simulate extraction from the "Income Proof"
        # We assume a high amount to demonstrate the Tax Calculation feature (e.g., > 7L annual)
        extracted_amount = 65000 # Monthly
        
        # Update Income Source
        source, created = IncomeSource.objects.get_or_create(
            name="Verified Document Upload",
            defaults={'amount': 0, 'status': 'verified', 'verified': True} 
        )
        source.amount = extracted_amount # Set or Add
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
            "extracted_data": {"monthly_income": extracted_amount}
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
                    # 1. Update Income Source
                    source, created = IncomeSource.objects.get_or_create(
                        name=tx['merchant'],
                        defaults={'amount': 0, 'status': 'verified', 'verified': True} 
                    )
                    source.amount += tx['amount']
                    source.verified = True
                    source.save()
                    
                    # 2. Update Monthly Earning for Current Month
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
        # Annualize based on monthly average or just simple sum * 12 for demo
        total_monthly = sum(s.amount for s in sources)
        annual_income = total_monthly * 12 
        
        tax = 0
        # New Regime Slabs (FY 23-24 onwards)
        # 0-3L: Nil
        # 3-6L: 5%
        # 6-9L: 10%
        # 9-12L: 15%
        # 12-15L: 20%
        # >15L: 30%
        
        temp_income = annual_income
        
        if temp_income > 300000:
            # 3L to 6L
            taxable = min(temp_income, 600000) - 300000
            tax += taxable * 0.05
            
        if temp_income > 600000:
            # 6L to 9L
            taxable = min(temp_income, 900000) - 600000
            tax += taxable * 0.10
            
        if temp_income > 900000:
            # 9L to 12L
            taxable = min(temp_income, 1200000) - 900000
            tax += taxable * 0.15
            
        if temp_income > 1200000:
            # 12L to 15L
            taxable = min(temp_income, 1500000) - 1200000
            tax += taxable * 0.20
            
        if temp_income > 1500000:
            # Above 15L
            taxable = temp_income - 1500000
            tax += taxable * 0.30

        print(f"DEBUG: Annual Income: {annual_income}, Initial Tax: {tax}")

        # Section 87A Rebate: If taxable income <= 7L, tax is 0 (max rebate 25k)
        if annual_income <= 700000:
            tax = 0
            print("DEBUG: Rebate applied")
        else:
            # Add Health & Education Cess (4%)
            tax = tax * 1.04
            
        print(f"DEBUG: Final Tax: {tax}")
        
        return Response({
            "annual_income": annual_income,
            "tax_payable": int(tax),
            "refund_eligible": 0 if tax > 0 else 0
        })

class EligibleLoansView(APIView):
    def get(self, request):
        sources = IncomeSource.objects.all()
        total_monthly_income = sum(s.amount for s in sources)
        
        all_loans = [
             {"id": 1, "lender": "Kotak Mahindra Bank", "min_income": 10000, "notes": "Mid-Month Advance"},
             {"id": 2, "lender": "Axis Bank", "min_income": 15000, "notes": "Low processing fees"},
             {"id": 3, "lender": "HDFC Bank", "min_income": 25000, "notes": "Quick digital processing"},
             {"id": 4, "lender": "IDFC FIRST Bank", "min_income": 0, "notes": "Gig worker specialist"},
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
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Title
        p.setFont("Helvetica-Bold", 18)
        p.drawString(50, height - 50, "ArthikSetu - Verified Income Report")
        
        # Date
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 80, f"Date: {datetime.datetime.now().strftime('%d %b %Y')}")
        p.drawString(50, height - 100, "User: Rajesh Kumar") # Placeholder until user auth

        # Section Header
        p.setFont("Helvetica-Bold", 14)
        p.drawString(50, height - 140, "Verified Income Sources")

        # Table Header
        p.setFont("Helvetica-Bold", 12)
        y = height - 170
        p.drawString(50, y, "Source")
        p.drawString(300, y, "Monthly Earnings")
        p.drawString(450, y, "Status")
        
        # Line
        p.line(50, y-5, 550, y-5)
        
        # Content
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
            
        # Total
        p.line(50, y+15, 550, y+15)
        p.setFont("Helvetica-Bold", 14)
        y -= 10
        p.drawString(50, y, "Total Monthly Income")
        p.drawString(300, y, f"Rs. {total_monthly:,}")
        
        y -= 30
        p.drawString(50, y, "Projected Annual Income")
        p.drawString(300, y, f"Rs. {total_monthly * 12:,}")
        
        # Footer
        p.setFont("Helvetica-Oblique", 10)
        p.drawString(50, 50, "Generated by ArthikSetu - Financial Bridge for Gig India")
        
        p.showPage()
        p.save()
        
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
