from django.db import models

# Create your models here.
from django.db import models

class IncomeSource(models.Model):
    STATUS_CHOICES = [
        ('verified', 'Verified'),
        ('needs-proof', 'Needs Proof'),
        ('add', 'Add'),
    ]

    name = models.CharField(max_length=100)
    amount = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class MonthlyEarning(models.Model):
    month = models.CharField(max_length=10)
    amount = models.PositiveIntegerField()

    def __str__(self):
        return self.month
