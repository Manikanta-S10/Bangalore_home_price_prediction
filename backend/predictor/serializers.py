from rest_framework import serializers

class HomePricePredictionSerializer(serializers.Serializer):
    location = serializers.CharField()
    sqft = serializers.FloatField(min_value=1)
    bath = serializers.IntegerField(min_value=0)
    bhk = serializers.IntegerField(min_value=0)

