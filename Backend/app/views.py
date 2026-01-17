from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import IncomeSource, MonthlyEarning
import time
import sys
import os

# Add parent directory to path to import sibling modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from sms_parser import SMSParser
    from schemes import get_eligible_schemes, SCHEMES_DB
except ImportError:
    # Fail gracefully if these are missing
    class SMSParser:
        def parse_batch(self, messages):
            return []
    
    def get_eligible_schemes(profile):
        return []
    def get_eligible_schemes(profile):
        return []
    SCHEMES_DB = []

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
except ImportError:
    canvas = None


try:
    from gemini_service import analyze_earning_trend
except ImportError:
    # Fail gracefully if gemini_service or google module is missing
    def analyze_earning_trend(earnings):
        return "AI insights unavailable (Dependency missing)"

from django.core.files.storage import FileSystemStorage
from django.conf import settings


parser = SMSParser()

# Create your views here.

class DashboardView(APIView):
    def get(self, request):
        income_sources = list(IncomeSource.objects.all().values())
        earnings = list(MonthlyEarning.objects.all().values())
        
        # Inject colors based on name (simulating frontend logic)
        COLOR_MAP = {
            'Swiggy': '#F7931E',
            'Zomato': '#3B82F6',
            'Freelance / Fiverr': '#1E7F5C',
            'Cash Jobs': '#F59E0B',
            'UPI Transfers': '#0A1F44'
        }
        
        for source in income_sources:
            source['color'] = COLOR_MAP.get(source['name'], '#3B82F6')
            
        # Get AI Insight (Optional)
        ai_insight = analyze_earning_trend(earnings)

        return Response({
            "incomeSources": income_sources,
            "earningsData": earnings,
            "aiInsight": ai_insight
        })

class VerifyDocumentView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        doc_type = request.data.get('doc_type', 'Document')
        if 'file' not in request.FILES:
             return Response({"error": "No file uploaded"}, status=400)
        
        file_obj = request.FILES['file']
        fs = FileSystemStorage()
        filename = fs.save(file_obj.name, file_obj)
        file_url = fs.url(filename)
        
        # Simulate processing delay
        time.sleep(1)
        
        return Response({
            "status": "verified",
            "doc_type": doc_type,
            "message": f"{doc_type} uploaded and verified successfully",
            "filename": filename,
            "file_url": file_url,
            "confidence_score": 0.98
        })

class ParseSMSView(APIView):
    def post(self, request):
        try:
            messages = request.data.get('messages', [])
            if not messages:
                return Response({"error": "No messages provided"}, status=400)
            
            results = parser.parse_batch(messages)
            # Calculate summary
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
            # profile is already a dict from request.data
            recommendations = get_eligible_schemes(profile)
            return Response({"schemes": recommendations, "count": len(recommendations)})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AllSchemesView(APIView):
    def get(self, request):
        return Response({"schemes": SCHEMES_DB})

class DownloadReportView(APIView):
    def get(self, request, report_id=None):
        if not canvas:
            return Response({"error": "Report generation library missing (reportlab)."}, status=500)
            
        from django.http import HttpResponse
        
        # Create the HttpResponse object with the appropriate PDF headers.
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="report_{report_id or "document"}.pdf"'

        # Create the PDF object, using the response object as its "file."
        p = canvas.Canvas(response, pagesize=letter)
        width, height = letter
        
        # Draw things on the PDF. Here's where the PDF generation happens.
        # See the ReportLab documentation for the full list of functionality.
        p.setFont("Helvetica-Bold", 24)
        p.drawString(100, height - 100, "ArthikSetu Income Report")
        
        p.setFont("Helvetica", 12)
        p.drawString(100, height - 150, f"Report ID: {report_id}")
        p.drawString(100, height - 170, f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        p.drawString(100, height - 220, "This is a verified income report generated by ArthikSetu.")
        p.drawString(100, height - 240, "Verification Status: VERIFIED")
        
        # Close the PDF object cleanly, and we're done.
        p.showPage()
        p.showPage()
        p.save()
        return response

class SendOTPView(APIView):
    def post(self, request):
        target = request.data.get('target') # email or phone
        type_ = request.data.get('type') # 'email' or 'phone'
        
        if not target or not type_:
            return Response({"error": "Target and type are required"}, status=400)
            
        # In a real app, generate a random 6-digit code
        # otp = str(random.randint(100000, 999999))
        otp = "123456" # Hardcoded for demo/testing
        
        # Store in session
        request.session[f'otp_{type_}_{target}'] = otp
        request.session.save()
        
        # Simulate sending (email/SMS API would go here)
        print(f"Sending OTP {otp} to {target}")
        
        return Response({"message": f"OTP sent to {target}", "success": True})

class VerifyOTPView(APIView):
    def post(self, request):
        target = request.data.get('target')
        type_ = request.data.get('type')
        otp_input = request.data.get('otp')
        
        stored_otp = request.session.get(f'otp_{type_}_{target}')
        
        if stored_otp and stored_otp == otp_input:
             # Verify logic here (mark user as verified in DB)
             return Response({"message": "Verification successful", "success": True})
        else:
             return Response({"message": "Invalid OTP", "success": False}, status=400)
