$("#menu-toggle").click(function(e) {
    //Exibe o menu ao ser clickado
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
var selec=false;

$('#menu-toggle').on('click', function(e){
  //Se o menu estiver aberto
  if(selec){
    selec=false;
    $('#menu-icon').css('color', 'dimgray');
    //Para o edge
    $('#sidebar-wrapper').css('overflow-y','hide');
  }else{
      //Se o menu estiver fechado
      selec=true;
      $('#menu-icon').css('color', 'white');
      //Para o edge
      $('#sidebar-wrapper').css('overflow-y','scroll');
  }
});
//Para cada letra digitada na filtragem de amigos
$('#filtrarAmigos').keyup(function(event) {
    //Para cada amigo carregado
    $(".amigo").each(function(i, item){
      //Pega o objeto JQuery da div do amigo
      item=$(item);
      //Pega o atributo title para identificar o nome do amigo
      let anchor = item.children(":first").children(":first");
      //Se o nome conter a string pesquisada
      if(anchor.attr('title').indexOf($("#filtrarAmigos").val())!==-1){
        //Mostra o amigo
        item.show();
      }else{
        //Esconde o amigo
        item.hide();
      }
    });
});
