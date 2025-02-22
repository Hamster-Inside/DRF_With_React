from rest_framework.generics import ListCreateAPIView
from .models import Project
from .serializers import ProjectSerializer

class ProjectListView(ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
