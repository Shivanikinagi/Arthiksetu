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

class Earning(models.Model):
    """Model to store individual earning entries from Android Studio"""
    platform = models.CharField(max_length=50)
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.platform} - Rs.{self.amount} ({self.created_at.strftime('%Y-%m-%d')})"
    
    class Meta:
        ordering = ['-created_at']  # Most recent first