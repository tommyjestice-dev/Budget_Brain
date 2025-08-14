from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        extra_kwargs = {
            'category' : {'required': False, 'allow_null': True },
            'user': {'read_only': True}

        }

   
