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
    # Ensure standard import works if path is correct
    pass

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

        return Response({
            "incomeSources": income_sources,
            "earningsData": earnings
        })

class VerifyDocumentView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        doc_type = request.data.get('doc_type', 'Document')
        file_obj = request.FILES.get('file')
        
        # Simulate processing delay
        time.sleep(2)
        
        # In a real app, we would process the file here
        
        return Response({
            "status": "verified",
            "doc_type": doc_type,
            "message": f"{doc_type} verified successfully",
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
