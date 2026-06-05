from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import HomePricePredictionSerializer
from .ml_model import home_price_model

# Create your views here.
@api_view(["GET"])
def get_locations(request):
    try:
        locations = home_price_model.get_locations()

        return Response({
            "success": True,
            "locations":locations
        })
    
    except Exception as e:
        return Response({
            "success": False,
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(["POST"])
def predict_home_price(request):
    serializer = HomePricePredictionSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "success": False,
            "errors": serializer.errors 
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data

    try:
        estimated_price = home_price_model.predict_price(
            location=data['location'],
            sqft=data['sqft'],
            bath=data['bath'],
            bhk=data['bhk']
        )

        return Response({
            "success": True,
            "input": {
                "location":data['location'],
                 "sqft": data["sqft"],
                "bath": data["bath"],
                "bhk": data["bhk"]
            },
            "estimated_price":estimated_price
        })
    
    except Exception as e:
        return Response({
            "success": False,
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

