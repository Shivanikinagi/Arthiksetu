from rest_framework.views import APIView
from rest_framework.response import Response
from .models import IncomeSource, MonthlyEarning


class DashboardView(APIView):
    def get(self, request):
        income_sources = IncomeSource.objects.all().values()
        earnings = MonthlyEarning.objects.all().values()

        return Response({
            "incomeSources": list(income_sources),
            "earningsData": list(earnings)
        })
