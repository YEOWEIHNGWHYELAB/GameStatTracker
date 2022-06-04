from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import SendEmailResetSerializer

User = get_user_model()
