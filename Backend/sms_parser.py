import re
from datetime import datetime

class SMSParser:
    def __init__(self):
        # Patterns for extraction
        self.amount_pattern = re.compile(
            r'(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)|([\d,]+(?:\.\d{1,2})?)\s*(?:INR|Rs\.?|₹)',
            re.IGNORECASE,
        )
        self.fallback_number_pattern = re.compile(r'\b([1-9]\d{2,}(?:\.\d{1,2})?)\b')

        self.merchant_patterns = {
            'Zomato': re.compile(r'zomato', re.IGNORECASE),
            'Swiggy': re.compile(r'swiggy', re.IGNORECASE),
            'Zepto': re.compile(r'zepto', re.IGNORECASE),
            'Blinkit': re.compile(r'blinkit|grofers', re.IGNORECASE),
            'Dunzo': re.compile(r'dunzo', re.IGNORECASE),
            'Uber': re.compile(r'uber', re.IGNORECASE),
            'Ola': re.compile(r'ola', re.IGNORECASE),
            'Porter': re.compile(r'porter', re.IGNORECASE),
            'Rapido': re.compile(r'rapido', re.IGNORECASE),
            'UrbanCompany': re.compile(r'urban\s*company|urbanclap', re.IGNORECASE),
            'Amazon': re.compile(r'amazon', re.IGNORECASE), # Flex
            'Flipkart': re.compile(r'flipkart', re.IGNORECASE), # Delivery
        }

        self.credit_pattern = re.compile(
            r'(credited|received|added|deposited|payout|settlement|salary\s+credit|cashback\s+credited)',
            re.IGNORECASE,
        )
        self.debit_pattern = re.compile(
            r'(debited|deducted|spent|paid|sent|dr\b|purchase|upi\s+transaction\s+to|transferred\s+to)',
            re.IGNORECASE,
        )

        self.date_patterns = [
            re.compile(r'\b(\d{1,2}[\-/][A-Za-z]{3}[\-/]\d{2,4})\b'),
            re.compile(r'\b(\d{1,2}[\-/]\d{1,2}[\-/]\d{2,4})\b'),
            re.compile(r'\b([A-Za-z]{3,9}\s+\d{1,2},\s*\d{2,4})\b'),
        ]

        # Platforms to explicitly allow (Gig/Work platforms)
        self.allowed_platforms = {
            'Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Dunzo', 
            'Uber', 'Ola', 'Porter', 'Rapido', 'UrbanCompany',
            'Amazon', 'Flipkart'
        }

    def _extract_amount(self, text):
        amount_match = self.amount_pattern.search(text)
        if amount_match:
            amount_str = amount_match.group(1) or amount_match.group(2)
            if amount_str:
                try:
                    return float(amount_str.replace(',', ''))
                except ValueError:
                    return 0.0

        # Conservative fallback for cases where currency token is missing.
        # We avoid very short numbers to reduce false positives (OTP, balances, ids).
        fallback = self.fallback_number_pattern.search(text)
        if fallback:
            try:
                return float(fallback.group(1).replace(',', ''))
            except ValueError:
                return 0.0

        return 0.0

    def _extract_merchant(self, text):
        for name, pattern in self.merchant_patterns.items():
            if pattern.search(text):
                return name
        return "Unknown"

    def _extract_type(self, text):
        if self.credit_pattern.search(text):
            return 'credit'
        if self.debit_pattern.search(text):
            return 'debit'
        return 'unknown'

    def _extract_date(self, text):
        for pattern in self.date_patterns:
            date_match = pattern.search(text)
            if date_match:
                return date_match.group(1)
        return datetime.now().strftime('%Y-%m-%d')

    def _build_description(self, parsed):
        merchant = parsed['merchant']
        ttype = parsed['type']
        amount = parsed['amount']
        if ttype == 'credit':
            return f"Credit of Rs {amount:,.2f} from {merchant}"
        if ttype == 'debit':
            return f"Debit of Rs {amount:,.2f} to {merchant}"
        return f"Transaction of Rs {amount:,.2f} involving {merchant}"

    def extract_info(self, text):
        data = {
            "amount": 0.0,
            "merchant": "Unknown",
            "type": "unknown",  # credit/debit/unknown
            "date": datetime.now().strftime('%Y-%m-%d'),
            "description": "",
            "raw": text
        }

        data['amount'] = self._extract_amount(text)
        data['merchant'] = self._extract_merchant(text)
        data['type'] = self._extract_type(text)
        data['date'] = self._extract_date(text)
        data['description'] = self._build_description(data)

        return data

    def parse_batch(self, messages):
        results = []
        for msg in messages:
            info = self.extract_info(msg)
            # Strict filter: known platforms + valid amount.
            if info['merchant'] in self.allowed_platforms and info['amount'] > 0:
                results.append(info)
        return results
