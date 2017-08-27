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
function modalGrupos(){
  $('#modalDinamico').empty();
  let conteudo =`
  <div class="modal fade" id="modalGrupos" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" onclick='$("#modalGrupos").modal("hide");' aria-hidden="true">
						×
					</button>
					<h2 class="modal-title">
						Criar um novo Grupo
					</h2>
				</div>
				<div class="modal-body">
					<form action="javascript:criarGrupo()" id="criarIconeForm" name="criarIconeForm">
						<div class="form-group">
              <label for="comment">Nome do grupo:</label>
              <input required type="text" id="nomeGrupo" class="form-control" placeholder="Nome para o Grupo">
              <label for="comment">Descrição do grupo:</label>
              <textarea class="form-control" rows="5" id="comment" required></textarea>
              <label for="comment">Cor do grupo:</label>
              <div class="row">
                <div class="col-md-4">
                  <input required type="color" id="corGrupo" class="form-control">
                </div>
                <div class="col-md-8">
                  <label class="radio-inline"><input type="radio" name="Privacidade" value="1">Privado</label>
                  <label class="radio-inline"><input type="radio" name="Privacidade" value="2">Púlico</label>
                  <label class="radio-inline"><input type="radio" name="Privacidade" value="3">Apenas Amigos</label>
                </div>
              </div>
						</div>
					</form>
				<div class="modal-footer">
					<button type="submit" form="criarIconeForm"  class="btn btn-success"> Criar Grupo </button>
					<button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
				</div>
			</div>
		</div>
	</div>
</div>`;
$('#modalDinamico').html(conteudo);
$('#modalGrupos').modal('show');
}
function criarGrupo(){

}
