from django.contrib import admin
from .models import IncomeSource, MonthlyEarning

# Register your models here so they show up in the admin panel
admin.site.register(IncomeSource)
admin.site.register(MonthlyEarning)
