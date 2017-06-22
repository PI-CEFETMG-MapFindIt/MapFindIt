from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.home),
    url(r'^home/$', views.feed, name="feed"),
    url(r'^perfil/(?P<idusuario>[0-9]+)/$', views.perfil, name="perfil"),
    url(r'^ajax/checkarEmail/$', views.checkarEmail),
    url(r'^ajax/checkarLogin/$', views.checkarLogin),
    url(r'^ajax/checkarSenha/$', views.checkarSenha),
    url(r'^ajax/carregarMapasPerfil/$', views.mapasPerfil),
    url(r'^ajax/carregarMapasHome/$', views.mapasHome),
    url(r'^ajax/carregarMapasHomePesquisa/$', views.mapasHomePesquisa),
    url(r'^ajax/salvarComentario/$', views.salvarComentario),
    url(r'^ajax/adicionarView/$', views.adicionarView),
    url(r'^ajax/criarAmizade/$', views.criarAmizade),
    url(r'^ajax/aceitarAmizade/$', views.aceitarAmizade),
    url(r'^ajax/recusarAmizade/$', views.recusarAmizade),
	url(r'^novoMapa/$', views.novoMapa),
    url(r'^ajax/getTemas/$', views.getTemas),
    url(r'^ajax/adicionarTema/$', views.adicionarTema),
    url(r'^editarMapa/(?P<idmapa>[0-9]+)/$', views.editarMapa, name="editar")
]
