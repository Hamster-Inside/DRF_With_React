from rest_framework import serializers
from rest_registration.api.serializers import DefaultRegisterUserSerializer
from .models import CustomUser
from django.contrib.auth import authenticate
from drf_recaptcha.fields import ReCaptchaV2Field


class CustomUserSerializer(DefaultRegisterUserSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'password', 'password_confirm', 'email_confirmed', 'recaptcha')
        extra_kwargs = {
            'id': {'read_only': True},
            'email_confirmed': {'read_only': True},
            'recaptcha': {'required': True},
        }

    def get_fields(self):
        fields = super().get_fields()
        fields['recaptcha'] = ReCaptchaV2Field()
        return fields

    def create(self, validated_data):
        password_confirm = validated_data.pop('password_confirm', None)
        recaptcha = validated_data.pop('recaptcha', None)
        user = CustomUser.objects.create_user(**validated_data)
        return user


class CustomLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)

            if not user:
                raise serializers.ValidationError("Invalid login credentials. Please try again.")

            data['user'] = user
        else:
            raise serializers.ValidationError("Both email and password are required for login.")

        return data
