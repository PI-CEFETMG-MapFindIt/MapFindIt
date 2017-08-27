//Indica qual ferramenta está sendo usada
var ferramentaSelec=-1;
//Mapa sendo editado
var map;
//Markers e Poligonos do mapa
var marcadores=[];
var poligonos=[];
var rotasArr=[];
var infoWindows=[];

//Desenha o icone de marker
function pinSymbol(color) {
		//Retorna o desenho de um ponto de determinada cor
		if(color=='#000' || color=='#000000' || color=='rgb(0,0,0)'){
			//Se o ponto for preto o contorno é branco
			return {
	        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
	        fillColor: color,
	        fillOpacity: 1,
	        strokeColor: '#FFF',
	        strokeWeight: 1,
	        scale: 1,
	   };
		}else{
			//Para outras cores o contorno é preto
			return {
	        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
	        fillColor: color,
	        fillOpacity: 1,
	        strokeColor: '#000',
	        strokeWeight: 2,
	        scale: 1,
	   };
		}
}

/*
  Ponto = 0;
  Área = 1;
  Rota = 2;
*/
function selecionar(idt){
   //Ferramenta escolhida e sua categoria
   let pai, elem;
   //Remove uma ferramenta já escolhida
   if(ferramentaSelec!=-1){
     let paiR, elemR;
     switch(ferramentaSelec){
       case 0: paiR=$('#selecInserir');
               elemR=$('#selecPonto');
               break;
       case 1: paiR=$('#selecInserir');
               elemR=$('#selecArea');
               arrayPontosArea=[];
               if(areaTemp)
                  areaTemp.setMap(null);
               break;
       case 2: paiR=$('#selecInserir');
               elemR=$('#selecRota');
               if(tempRota){
                 tempRota.setMap(null);
                 for(let i=0; i<tempMarker.length; i++){
                   tempMarker[i].setMap(null);
                 }
               }
               break;
     }
     paiR.removeClass('selecionado');
     elemR.removeClass('selecionado');
     $('#botoesContainer').empty();
     map.setOptions({ draggableCursor : 'auto' });
   }
   //Estiliza os elementos da ferramenta escolhida, caso ela não estivesse já selecionada
   if(idt!=ferramentaSelec){
     switch(idt){
       case 0: pai=$('#selecInserir');
               elem=$('#selecPonto');
               map.setOptions({ draggableCursor : 'url("'+imgUrl+'MapFindIt/iconesEditar/Ponto.png"), auto' });
               break;
       case 1: pai=$('#selecInserir');
               elem=$('#selecArea');
               map.setOptions({ draggableCursor : 'url("'+imgUrl+'MapFindIt/iconesEditar/Area.png"), auto' });
               break;
       case 2: pai=$('#selecInserir');
               elem=$('#selecRota');
               map.setOptions({ draggableCursor : 'url("'+imgUrl+'MapFindIt/iconesEditar/Rota.png"), auto' });
               break;
     }
     pai.addClass('selecionado');
     elem.addClass('selecionado');
     ferramentaSelec=idt;
   }else{
     ferramentaSelec=-1;
   }
}

//Função para mudar a imagem do Crop do Ponto
function readURLPonto(input) {
		if (input.files && input.files[0]) {
		    var reader = new FileReader();
		    reader.onload = function (e) {
		        $('#novaImgPonto').attr('src', e.target.result);
            $('#novaImgPonto').cropper({
              aspectRatio: 1/1,
              crop: function(e) {

              }
            });
		    }
        reader.readAsDataURL(input.files[0]);
    }
}
//Arquivo de imagem em blob
var blobFinalPonto;
function mudarImagemPonto(){
		//Obtem a imagem cropped em blob
    $("#novaImgPonto").cropper('getCroppedCanvas').toBlob(function (blob) {
		      var reader = new window.FileReader();
		      reader.readAsDataURL(blob);
		      reader.onloadend = function() {
          base64data = reader.result;
          blobFinalPonto=base64data;
      }
    });
}

//Cria o ponto no banco
function criarPonto(lat, lng){
   if($('#imgInpPonto').val()){
     mudarImagemPonto();
   }
   setTimeout(function () {
     $.ajax({
         url: '/ajax/criarPonto/',
         data: {
           'titulo': $('#pontoTitulo').val(),
           'desc': $('#pontoDesc').val(),
           'coordx': lng,
           'coordy': lat,
           'idMapa': idMapa,
           'idUsuario': idUsuarioLogado
         },
         dataType: 'json',
         success: function (data) {
           if(blobFinalPonto){
             $.ajax({
                 url: '/ajax/criarImagemPonto/'+data.id+'/',
                 type: 'POST',
                 data: {
                   'img':blobFinalPonto,
                   'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
                 },
                 dataType: 'json',
                 success: function (data) {
                    carregarMapa({'lat': lat, 'lng': lng});
                 }
             });
             blobFinalPonto='';
           }else{
             carregarMapa({'lat': lat, 'lng': lng});
           }
         }
     });
   }, 500);

}

//Para o cropper do icone
$(document).on('change','#imgInpIcone',function(){
  readURLIcone(this);
});

function readURLIcone(input) {
		if (input.files && input.files[0]) {
		    var reader = new FileReader();
		    reader.onload = function (e) {
		        $('#novaImgIcone').attr('src', e.target.result);
            $('#novaImgIcone').cropper({
              aspectRatio: 1/1,
              crop: function(e) {

              }
            });
		    }
        reader.readAsDataURL(input.files[0]);
    }
}
//Arquivo de imagem em blob
var blobFinalIcone="";
function mudarImagemIcone(){
		//Obtem a imagem cropped em blob
    $("#novaImgIcone").cropper('getCroppedCanvas').toBlob(function (blob) {
		      var reader = new window.FileReader();
		      reader.readAsDataURL(blob);
		      reader.onloadend = function() {
          base64data = reader.result;
          blobFinalIcone=base64data;
      }
    });
}

//Para criar o icone
function criarIcone(){
    mudarImagemIcone();
    //Timeout para tempo de gerar a imagem
    setTimeout(function () {
      if(blobFinalIcone!=""){
        $.ajax({
            url: '/ajax/criarIcone/',
            type: 'POST',
            data: {
              'nome': $('#legendaIcone').val(),
              'icone': blobFinalIcone,
              'usuario': idUsuarioLogado,
              'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
							$('#modal-criar-icone').modal('hide');


            }
        });
        blobFinalIcone='';
      }
    }, 500);
}
function clearChildren(element) {
   for (var i = 0; i < element.childNodes.length; i++) {
      var e = element.childNodes[i];
      if (e.tagName) switch (e.tagName.toLowerCase()) {
         case 'input':
            switch (e.type) {
               case "radio":
               case "checkbox": e.checked = false; break;
               case "button":
               case "submit":
               case "image": break;
               default: e.value = ''; break;
            }
            break;
         case 'select': e.selectedIndex = 0; break;
         case 'textarea': e.innerHTML = ''; break;
         default: clearChildren(e);
      }
   }
}

//Para inserir ponto no mapa
function inserirPonto(evento){
  var contentString =
      `<div id="content">
         <form id="pontoForm" action="javascript:criarPonto(${evento.latLng.lat()}, ${evento.latLng.lng()})">
            <div class="form-group">
               <input id="pontoTitulo" required type="text" class="form-control" placeholder="Titulo do Ponto">
            </div>
            <div class="form-group">
               <textarea id="pontoDesc" class="form-control" placeholder="Descrição do Ponto" rows=2></textarea>
            </div>
            <div class="form-group" height="150px">
              <div class="input-group">
                  <span class="input-group-btn center">
                      <span class="btn btn-default btn-file">
                          Escolher Imagem do Ponto... <input accept="image/*" type="file" id="imgInpPonto">
                      </span>
                  </span>
              </div>
              <br>
              <img id='novaImgPonto'/>
            </div>
            <div class="form-group">
               <button type="submit" class="btn btn-default">Criar Ponto</button>
            </div>
         </form>
      </div>`;
  let infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  //Para o upload de imagens
  $(document).on('change','#imgInpPonto',function(){
    readURLPonto(this);
  });
  let marker = new google.maps.Marker({
    position: evento.latLng,
    map: map
  });
  infowindow.open(map, marker);
  google.maps.event.addListener(infowindow,'closeclick', function(){
     marker.setMap(null); //Remove marker
  });

}

//Icone escolhido pelo usuário
var iconeEscolhido;

function salvarIcone(id){
  $.ajax({
      url: '/ajax/salvarIcone/',
      data: {
        'id': id,
        'idIcone': iconeEscolhido
      },
      dataType: 'json',
      success: function (data) {
        if(data.sucesso){
          carregarMapa(map.getCenter());
          $('#modal-icone').modal('hide');
        }
      }
   });
}

//Elementos para a escolha do icone
function selectIcone(id){
  $.ajax({
      url: '/ajax/getTodosIcones/',
      data: {
        'id': idUsuarioLogado
      },
      dataType: 'json',
      success: function (data) {
         if(data.icones){
             $('#modalDinamico').empty();
             let conteudo=`
             <div class="modal fade" style="top:-5%;" id="modal-icone" aria-hidden="true">
               <div class="modal-dialog" style="width: 80vw;">
                 <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" onclick='$("#modal-icone").modal("hide");' aria-hidden="true">
                       ×
                     </button>
                     <h4 class="modal-title">
                       Deletar Icone
                     </h4>
                   </div>
                   <div class="modal-body" style="overflow: scroll; overflow-x: hidden; height: 80vh;">
                     <div class="centerDiv">
                        <input id="filtrarIcones" type="text" placeholder="Filtrar icones" style="width:96%; height:90%;">
                        <br>
                        <br>
                        <br>
                     </div>
                     <div id="container-icones" style="display: flex; flex-direction: row; flex-wrap: wrap;">

                     </div>
                   </div>
                   <div class="modal-footer">
                     <button type="button" id="btnDeletar" class="btn btn-success"> Escolher Icone </button>
                     <button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
                   </div>
                 </div>
               </div>
             </div>
             `;
             $('#modalDinamico').html(conteudo);
             let icones=JSON.parse(data.icones);
             let container=$("#container-icones");
             for(let i=0; i<icones.length; i++){
                item=icones[i].fields;
                $('#container-icones').append(`
                  <div id='icone${icones[i].pk}' class="imagemIcone centerDiv">
                    <img src='${imgUrl}MapFindIt/ImagemIcones/${icones[i].pk}.png'>
                    <p>${item.nomeicone}</p>
                  </div>
                  `);
             }
             $('.imagemIcone').on('click', function(){
                 $('.imagemIcone').removeClass('iconeEscolhido');
                 $(this).addClass('iconeEscolhido');
                 //Salva o id do icone (id do elemento retirando-se a palavra icone)
                 iconeEscolhido=$(this).attr('id').substring(5);
								 $('#btnDeletar').on('click', function(){
									 deletarIcone(iconeEscolhido);
								 });
             });
             $('#filtrarIcones').keyup(function(event) {
                 //Para cada icone carregado
                 $(".imagemIcone").each(function(i, item){
                   //Pega o objeto JQuery da div do icone
                   item=$(item);
                   //Pega o titulo do icone para identifica-lo
                   let parag = item.children('p');
                   //Se o nome conter a string pesquisada
                   if(parag.text().indexOf($("#filtrarIcones").val())!==-1){
                     //Mostra o icone
                     item.show();
                   }else{
                     //Esconde o icone
                     item.hide();
                   }
                 });
             });
             $('#modal-icone').modal('show');

          }
      }
    });
}


function modalIcone(){
	$('#modalDinamico').empty();
	let conteudo=`<div class="modal fade" id="modal-criar-icone" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" onclick='$("#modal-criar-icone").modal("hide");' aria-hidden="true">
						×
					</button>
					<h4 class="modal-title">
						Criar Um Novo Icone
					</h4>
				</div>
				<div class="modal-body">
					<form action="javascript:criarIcone()" id="criarIconeForm" name="criarIconeForm">
						<div class="form-group">
							<input required type="text" id="legendaIcone" class="form-control" placeholder="Legenda para o Icone">
						</div>
						<div class="input-group">
								<span class="input-group-btn center">
										<span class="btn btn-default btn-file">
												Escolher Icone... <input accept="image/*" type="file" id="imgInpIcone">
										</span>
								</span>
						</div>
						<br>
						<img id='novaImgIcone'/>
					</form>
				<div class="modal-footer">
					<button type="submit" form="criarIconeForm"  class="btn btn-success"> Criar Icone </button>
					<button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
				</div>
			</div>
		</div>
	</div>
</div>`
		$('#modalDinamico').html(conteudo);
		$('#modal-criar-icone').modal('show');
}
function selIcone(id){
  $.ajax({
      url: '/ajax/getTodosIcones/',
      data: {
        'id': idUsuarioLogado
      },
      dataType: 'json',
      success: function (data) {
         if(data.icones){
             $('#modalDinamico').empty();
             let conteudo=`
             <div class="modal fade" style="top:-5%;" id="modal-icone" aria-hidden="true">
               <div class="modal-dialog" style="width: 80vw;">
                 <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" onclick='$("#modal-icone").modal("hide");' aria-hidden="true">
                       ×
                     </button>
                     <h4 class="modal-title">
                       Editar Icone
                     </h4>
                   </div>
                   <div class="modal-body" style="overflow: scroll; overflow-x: hidden; height: 80vh;">
                     <div class="centerDiv">
                        <input id="filtrarIcones" type="text" placeholder="Filtrar icones" style="width:96%; height:90%;">
                        <br>
                        <br>
                        <br>
                     </div>
                     <div id="container-icones" style="display: flex; flex-direction: row; flex-wrap: wrap;">

                     </div>
                   </div>
                   <div class="modal-footer">
                     <button type="button" id="btnDeletar" class="btn btn-success"> Escolher Icone </button>
                     <button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
                   </div>
                 </div>
               </div>
             </div>
             `;
             $('#modalDinamico').html(conteudo);
             let icones=JSON.parse(data.icones);
             let container=$("#container-icones");
             for(let i=0; i<icones.length; i++){
                item=icones[i].fields;
                $('#container-icones').append(`
                  <div id='icone${icones[i].pk}' class="imagemIcone centerDiv">
                    <img src='${imgUrl}MapFindIt/ImagemIcones/${icones[i].pk}.png'>
                    <p>${item.nomeicone}</p>
                  </div>
                  `);
             }
             $('.imagemIcone').on('click', function(){
                 $('.imagemIcone').removeClass('iconeEscolhido');
                 $(this).addClass('iconeEscolhido');
                 //Salva o id do icone (id do elemento retirando-se a palavra icone)
                 iconeEscolhido=$(this).attr('id').substring(5);
								 $('#btnDeletar').on('click', function(){
									 editarIcone(iconeEscolhido);
								 });
             });
             $('#filtrarIcones').keyup(function(event) {
                 //Para cada icone carregado
                 $(".imagemIcone").each(function(i, item){
                   //Pega o objeto JQuery da div do icone
                   item=$(item);
                   //Pega o titulo do icone para identifica-lo
                   let parag = item.children('p');
                   //Se o nome conter a string pesquisada
                   if(parag.text().indexOf($("#filtrarIcones").val())!==-1){
                     //Mostra o icone
                     item.show();
                   }else{
                     //Esconde o icone
                     item.hide();
                   }
                 });
             });
             $('#modal-icone').modal('show');
          }
      }
    });
}
function editarIcone(id){
$.ajax({
		url: '/ajax/getIcone/',
		data: {
			'id': idIcone
		},dataType: 'json',
		success: function (data) {
			 if(data.icones){
                $('#modal-icone').modal('hide');
                $('#modalDinamico').empty();
								item=icones[i].fields;
                let conteudo=`<div class="modal fade" id="modal-criar-icone" aria-hidden="true">
	                <div class="modal-dialog">
		                <div class="modal-content">
			                <div class="modal-header">
				                <button type="button" class="close" onclick='$("#modal-criar-icone").modal("hide");' aria-hidden="true">
					                ×
				                </button>
				                <h4 class="modal-title">
					                Editar
				                </h4>
			                </div>
			            <div class="modal-body">
				            <form action="javascript:salvarEdicao()" id="criarIconeForm" name="criarIconeForm">
					            <div class="form-group">
						            <input required type="text" id="legendaIcone" class="form-control" placeholder="item.nomeicone" value="item.nomeicone">
					            </div>
					            <div class="input-group">
							        <span class="input-group-btn center">
									    <span class="btn btn-default btn-file">
										    	Escolher Icone... <input accept="image/*" type="file" id="imgInpIcone" value="${imgUrl}MapFindIt/ImagemIcones/${icones.pk}.png">
									    </span>
							        </span>
					            </div>
					            <br>
					            <img id='novaImgIcone'/>
				            </form>
			                <div class="modal-footer">
				                <button type="submit" form="criarIconeForm"  class="btn btn-success"> Criar Icone </button>
				                <button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
			                </div>
		                </div>
	                </div>
                </div>
            </div>`
	        $('#modalDinamico').html(conteudo);
	        $('#modal-criar-icone').modal('show');
	        };
        }
    });
}

function deletarIcone(id){
	$.ajax({
      url: '/ajax/deletarIcone/',
      data: {
        'id': id
      },
      dataType: 'json',
      success: function (data) {
        if(data.sucesso){
          carregarMapa(map.getCenter());
          $('#modal-icone').modal('hide');
        }
      }
   });
}

//Elementos para a escolha do icone
function escolherIcone(id){
  $.ajax({
      url: '/ajax/getTodosIcones/',
      data: {
        'id': idUsuarioLogado
      },
      dataType: 'json',
      success: function (data) {
         if(data.icones){
             $('#modalDinamico').empty();
             let conteudo=`
             <div class="modal fade" style="top:-5%;" id="modal-icone" aria-hidden="true">
               <div class="modal-dialog" style="width: 80vw;">
                 <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" onclick='$("#modal-icone").modal("hide");' aria-hidden="true">
                       ×
                     </button>
                     <h4 class="modal-title">
                       Escolher icone para o ponto
                     </h4>
                   </div>
                   <div class="modal-body" style="overflow: scroll; overflow-x: hidden; height: 80vh;">
                     <div class="centerDiv">
                        <input id="filtrarIcones" type="text" placeholder="Filtrar icones" style="width:96%; height:90%;">
                        <br>
                        <br>
                        <br>
                     </div>
                     <div id="container-icones" style="display: flex; flex-direction: row; flex-wrap: wrap;">

                     </div>
                   </div>
                   <div class="modal-footer">
                     <button type="button" onclick="if(iconeEscolhido){salvarIcone(${id});}" class="btn btn-success"> Escolher Icone </button>
                     <button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
                   </div>
                 </div>
               </div>
             </div>
             `;
             $('#modalDinamico').html(conteudo);
             let icones=JSON.parse(data.icones);
             let container=$("#container-icones");
             for(let i=0; i<icones.length; i++){
                item=icones[i].fields;
                $('#container-icones').append(`
                  <div id='icone${icones[i].pk}' class="imagemIcone centerDiv">
                    <img src='${imgUrl}MapFindIt/ImagemIcones/${icones[i].pk}.png'>
                    <p>${item.nomeicone}</p>
                  </div>
                  `);
             }
             $('.imagemIcone').on('click', function(){
                 $('.imagemIcone').removeClass('iconeEscolhido');
                 $(this).addClass('iconeEscolhido');
                 //Salva o id do icone (id do elemento retirando-se a palavra icone)
                 iconeEscolhido=$(this).attr('id').substring(5);
             });
             $('#filtrarIcones').keyup(function(event) {
                 //Para cada icone carregado
                 $(".imagemIcone").each(function(i, item){
                   //Pega o objeto JQuery da div do icone
                   item=$(item);
                   //Pega o titulo do icone para identifica-lo
                   let parag = item.children('p');
                   //Se o nome conter a string pesquisada
                   if(parag.text().indexOf($("#filtrarIcones").val())!==-1){
                     //Mostra o icone
                     item.show();
                   }else{
                     //Esconde o icone
                     item.hide();
                   }
                 });
             });
             $('#modal-icone').modal('show');

          }
      }
    });
}

//Pontos da Rota
var arrayPontoRota=[];
//Rota sendo criada
var tempRota=null;
//Pontos da rota sendo criadas
var tempMarker=[];
//Grava a rota inserida
function gravaRota(){
  arrayX=[];
  arrayY=[];
  for(let i=0; i<arrayPontoRota.length; i++){
    arrayX[i]=arrayPontoRota[i].lng();
    arrayY[i]=arrayPontoRota[i].lat();
  }
  corRGB = hexToRgb($('#corRota').val());
  if($('#nomeCor').length>0){
    $.ajax({
        url: '/ajax/criarRota/',
        type: 'POST',
        data: {
          'nome': $('#nomeRota').val(),
          'desc': $('#descRota').val(),
          'usuario': idUsuarioLogado,
          'mapa': idMapa,
          'pontosX': JSON.stringify(arrayX),
          'pontosY': JSON.stringify(arrayY),
          'nomeCor': $('#nomeCor').val(),
          'r': corRGB.r,
          'g': corRGB.g,
          'b': corRGB.b,
          'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        dataType: 'json',
        success: function (data) {
          $('#modal-rota').modal("hide");
          carregarMapa(map.getCenter());
          selecionar('-1');
        }
    });
  }else{
    $.ajax({
        url: '/ajax/criarRota/',
        type: 'POST',
        data: {
          'nome': $('#nomeRota').val(),
          'desc': $('#descRota').val(),
          'usuario': idUsuarioLogado,
          'mapa': idMapa,
          'pontosX': JSON.stringify(arrayX),
          'pontosY': JSON.stringify(arrayY),
          'idCor': $('#idCor').val(),
          'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        dataType: 'json',
        success: function (data) {
          $('#modal-rota').modal("hide");
          carregarMapa(map.getCenter());
          selecionar('-1');
        }
    });
  }
}
//Finalizar a rota inserida
function finalizarRota(){
  if(arrayPontoRota.length>2){
      $('#modalDinamico').empty();
      $('#modalDinamico').append(`
        <div class="modal fade" id="modal-rota" aria-hidden="true">
          <div class="modal-dialog" style="width: 80vw;">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" onclick='$("#modal-area").modal("hide");' aria-hidden="true">
                  ×
                </button>
                <h4 class="modal-title">
                  Definir nome e descrição para rota
                </h4>
              </div>
              <div class="modal-body">
                <div class="centerDiv">
                  <form id="formRota" action="javascript:gravaRota()">
                     <div class="form-group">
                        <input required type="text" class="form-control input-lg" placeholder="Nome da Rota" id="nomeRota"/>
                     </div>
                     <div class="form-group">
                        <textarea rows=2 class="form-control input-lg" id="descRota" placeholder="Descrição da Rota"></textarea>
                     </div>
                     <div class="form-group" id="divCor">
                        <input required type="text" class="form-control input-lg" placeholder="Nome da Cor" id="nomeCor"/>
                     </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" form="formRota" class="btn btn-success"> Confirmar </button>
                <button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
              </div>
            </div>
          </div>
        </div>
        `);
        corRGB = hexToRgb($('#corRota').val());
        $.ajax({
            url: '/ajax/verificaCor/',
            data: {
              'r': corRGB.r,
              'g': corRGB.g,
              'b': corRGB.b
            },
            dataType: 'json',
            success: function (data) {
              if(data.existe){
                $('#divCor').empty();
                $('#divCor').append(`
                  <input type="hidden" id="idCor" value="${data.id}">
                  `);
              }
              $('#modal-rota').modal('show');
            }
        });
    }
}
//Para inserir rota
function inserirRota(e){
  let coord=e.latLng;
  if(arrayPontoRota.length==0){
    $('#botoesContainer').append(`<br>
      &nbsp;&nbsp;&nbsp;<label for="#corRota">Cor:&nbsp;&nbsp;</label><input type="color" id="corRota"/><br><br>
      &nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-default" onclick="finalizarRota();">Concluir Rota</button><br><br>
      &nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-default" onclick="selecionar(-1);">Cancelar Rota</button>
      `);
  }
  arrayPontoRota.push(coord);
  if(tempRota){
    tempRota.setMap(null);
    for(let i=0; i<tempMarker.length; i++){
      tempMarker[i].setMap(null);
    }
  }
  //Serviço de direções do google
  let directionsService = new google.maps.DirectionsService();
  //Serviço de exibição das rotas
  tempRota = new google.maps.DirectionsRenderer({
    polylineOptions: {
      //Cor da rota
      strokeColor: `${$('#corRota').val()}`,
      //Grossura do traçado
      strokeWeight: 5
    },
    //Remove o indicador de pontos padrão da google
    suppressMarkers: true,
    preserveViewport: true
  });
  //Cor dos pontos de uma rota
  let pinColor = `${$('#corRota').val()}`;
  //Para cada ponto cria uma marcacao com a cor da rota, e cria um evento de click para as marcacoes
  for(let x=0; x<arrayPontoRota.length; x++){
    let marker = new google.maps.Marker({
       position: arrayPontoRota[x],
       map: map,
       icon: pinSymbol(pinColor)
     });
     tempMarker.push(marker);
  }
  //Array para os pontos do "meio" da rota, sem incluir o primeiro e ultimo
  let waypts=Array();
  for(let x=1; x<arrayPontoRota.length-1; x++){
    waypts.push({location:arrayPontoRota[x], stopover:false});
  }
  //Define o mapa da rota
  tempRota.setMap(map);
  let request;
  if(waypts.length>0){
    //Se existem mais de dois pontos
    request = {
      origin: arrayPontoRota[0],
      destination: arrayPontoRota[arrayPontoRota.length-1],
      waypoints: waypts,
      travelMode: 'DRIVING'
    };
  }else{
    //Se existem apenas dois pontos
    request = {
      origin: arrayPontoRota[0],
      destination: arrayPontoRota[arrayPontoRota.length-1],
      travelMode: 'DRIVING'
    };
  }
  //Requisita a rota ao servidor da google
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      tempRota.setDirections(response);
    }
  });
  $('#corRota').on('change', function(){
    if(tempRota){
      tempRota.setMap(null);
      for(let i=0; i<tempMarker.length; i++){
        tempMarker[i].setMap(null);
      }
    }
    //Serviço de direções do google
    let directionsService = new google.maps.DirectionsService();
    //Serviço de exibição das rotas
    tempRota = new google.maps.DirectionsRenderer({
      polylineOptions: {
        //Cor da rota
        strokeColor: `${$('#corRota').val()}`,
        //Grossura do traçado
        strokeWeight: 5
      },
      //Remove o indicador de pontos padrão da google
      suppressMarkers: true,
      preserveViewport: true
    });
    //Cor dos pontos de uma rota
    let pinColor = `${$('#corRota').val()}`;
    //Para cada ponto cria uma marcacao com a cor da rota, e cria um evento de click para as marcacoes
    for(let x=0; x<arrayPontoRota.length; x++){
      let marker = new google.maps.Marker({
         position: arrayPontoRota[x],
         map: map,
         icon: pinSymbol(pinColor)
       });
       tempMarker.push(marker);
    }
    //Array para os pontos do "meio" da rota, sem incluir o primeiro e ultimo
    let waypts=Array();
    for(let x=1; x<arrayPontoRota.length-1; x++){
      waypts.push({location:arrayPontoRota[x], stopover:false});
    }
    //Define o mapa da rota
    tempRota.setMap(map);
    let request;
    if(waypts.length>0){
      //Se existem mais de dois pontos
      request = {
        origin: arrayPontoRota[0],
        destination: arrayPontoRota[arrayPontoRota.length-1],
        waypoints: waypts,
        travelMode: 'DRIVING'
      };
    }else{
      //Se existem apenas dois pontos
      request = {
        origin: arrayPontosRota[0],
        destination: arrayPontosRota[arrayPontoRota.length-1],
        travelMode: 'DRIVING'
      };
    }
    //Requisita a rota ao servidor da google
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        tempRota.setDirections(response);
      }
    });
  });
}
//Grava a area inserida
function gravaArea(){
  arrayX=[];
  arrayY=[];
  for(let i=0; i<arrayPontosArea.length; i++){
    arrayX[i]=arrayPontosArea[i].lng();
    arrayY[i]=arrayPontosArea[i].lat();
  }
  corRGB = hexToRgb($('#corArea').val());
  if($('#nomeCor').length>0){
    $.ajax({
        url: '/ajax/criarArea/',
        type: 'POST',
        data: {
          'nome': $('#nomeArea').val(),
          'desc': $('#descArea').val(),
          'usuario': idUsuarioLogado,
          'mapa': idMapa,
          'pontosX': JSON.stringify(arrayX),
          'pontosY': JSON.stringify(arrayY),
          'nomeCor': $('#nomeCor').val(),
          'r': corRGB.r,
          'g': corRGB.g,
          'b': corRGB.b,
          'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        dataType: 'json',
        success: function (data) {
          $('#modal-area').modal("hide");
          carregarMapa(map.getCenter());
          selecionar('-1');
        }
    });
  }else{
    $.ajax({
        url: '/ajax/criarArea/',
        type: 'POST',
        data: {
          'nome': $('#nomeArea').val(),
          'desc': $('#descArea').val(),
          'usuario': idUsuarioLogado,
          'mapa': idMapa,
          'pontosX': JSON.stringify(arrayX),
          'pontosY': JSON.stringify(arrayY),
          'idCor': $('#idCor').val(),
          'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        dataType: 'json',
        success: function (data) {
          $('#modal-area').modal("hide");
          carregarMapa(map.getCenter());
          selecionar('-1');
        }
    });
  }
}

//Função para converter cores
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

//Finalizar a area inserida
function finalizarArea(){
  if(arrayPontosArea.length>2){
      $('#modalDinamico').empty();
      $('#modalDinamico').append(`
        <div class="modal fade" id="modal-area" aria-hidden="true">
          <div class="modal-dialog" style="width: 80vw;">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" onclick='$("#modal-area").modal("hide");' aria-hidden="true">
                  ×
                </button>
                <h4 class="modal-title">
                  Definir nome e descrição para area
                </h4>
              </div>
              <div class="modal-body">
                <div class="centerDiv">
                  <form id="formArea" action="javascript:gravaArea()">
                     <div class="form-group">
                        <input required type="text" class="form-control input-lg" placeholder="Nome da Área" id="nomeArea"/>
                     </div>
                     <div class="form-group">
                        <textarea rows=2 class="form-control input-lg" id="descArea" placeholder="Descrição da Area"></textarea>
                     </div>
                     <div class="form-group" id="divCor">
                        <input required type="text" class="form-control input-lg" placeholder="Nome da Cor" id="nomeCor"/>
                     </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" form="formArea" class="btn btn-success"> Confirmar </button>
                <button type="button" data-dismiss="modal" class="btn btn-default"> Cancelar </button>
              </div>
            </div>
          </div>
        </div>
        `);
        corRGB = hexToRgb($('#corArea').val());
        $.ajax({
            url: '/ajax/verificaCor/',
            data: {
              'r': corRGB.r,
              'g': corRGB.g,
              'b': corRGB.b
            },
            dataType: 'json',
            success: function (data) {
              if(data.existe){
                $('#divCor').empty();
                $('#divCor').append(`
                  <input type="hidden" id="idCor" value="${data.id}">
                  `);
              }
              $('#modal-area').modal('show');
            }
        });

    }
}
//Pontos inseridos na área
var arrayPontosArea=[];
//Area temporaria
var areaTemp;
//Para inserir Area
function inserirArea(e){
   let coord=e.latLng;
   if(arrayPontosArea.length==0){
     $('#botoesContainer').append(`<br>
       &nbsp;&nbsp;&nbsp;<label for="#corArea">Cor:&nbsp;&nbsp;</label><input type="color" id="corArea"/><br><br>
       &nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-default" onclick="finalizarArea();">Concluir Área</button><br><br>
       &nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-default" onclick="selecionar(-1);">Cancelar Área</button>
       `);
   }
   arrayPontosArea.push(coord);
   if(areaTemp){
     areaTemp.setMap(null);
   }
   areaTemp = new google.maps.Polygon({
          paths: arrayPontosArea,
          strokeColor: $("#corArea").val(),
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: $("#corArea").val(),
          fillOpacity: 0.5
   });
   areaTemp.setMap(map);
   $('#corArea').on('change', function(){
     if(areaTemp){
       areaTemp.setMap(null);
     }
     areaTemp = new google.maps.Polygon({
            paths: arrayPontosArea,
            strokeColor: $("#corArea").val(),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: $("#corArea").val(),
            fillOpacity: 0.5
     });
     areaTemp.setMap(map);
   });
}
function carregarMapaInicial(){
  $('#divMapa').empty();
  $.ajax({
      url: '/ajax/carregarMapaEditar/',
      data: {
        'id': idMapa
      },
      dataType: 'json',
      success: function (data) {
        //Define o mapa
        let mapa=JSON.parse(data.mapa)[0].fields;
        let inicio={lat: mapa.coordyinicial, lng: mapa.coordxinicial}
        let pontoAreas = JSON.parse(data.pontoAreas);
        for(let i=0; i<pontoAreas.length; i++){
          pontoAreas[i]=JSON.parse(pontoAreas[i]);
        }
        let pontoRotas = JSON.parse(data.pontoRotas);
        for(let i=0; i<pontoRotas.length; i++){
          pontoRotas[i]=JSON.parse(pontoRotas[i]);
        }
        setMapa(mapa, JSON.parse(data.pontos), JSON.parse(data.icones), JSON.parse(data.rotas),
                pontoRotas, JSON.parse(data.areas), pontoAreas, 'divMapa', inicio, true);
      }
  });
  setTimeout(function(){
    google.maps.event.addListener(map, "click", function (e) {
      if(ferramentaSelec!=-1){
        switch(ferramentaSelec){
          case 0: inserirPonto(e); break;
          case 1: inserirArea(e); break;
          case 2: inserirRota(e); break;
        }
      }
    });
    iniciarBarraPesquisa();
  }, 1000);
}

function carregarMapa(inicio){
  $('#divMapa').empty();
  $.ajax({
      url: '/ajax/carregarMapaEditar/',
      data: {
        'id': idMapa
      },
      dataType: 'json',
      success: function (data) {
        //Define o mapa
        let mapa=JSON.parse(data.mapa)[0].fields;
        let pontoAreas = JSON.parse(data.pontoAreas);
        for(let i=0; i<pontoAreas.length; i++){
          pontoAreas[i]=JSON.parse(pontoAreas[i]);
        }
        let pontoRotas = JSON.parse(data.pontoRotas);
        for(let i=0; i<pontoRotas.length; i++){
          pontoRotas[i]=JSON.parse(pontoRotas[i]);
        }
        setMapa(mapa, JSON.parse(data.pontos), JSON.parse(data.icones), JSON.parse(data.rotas),
                pontoRotas, JSON.parse(data.areas), pontoAreas, 'divMapa', inicio, true);
      }
  });
  setTimeout(function(){
    google.maps.event.addListener(map, "click", function (e) {
      if(ferramentaSelec!=-1){
        switch(ferramentaSelec){
          case 0: inserirPonto(e); break;
          case 1: inserirArea(e); break;
          case 2: inserirRota(e); break;
        }
      }
    });
    iniciarBarraPesquisa();
  }, 1000);
}

function atualizarMapa(inicio){
  $.ajax({
      url: '/ajax/carregarMapaEditar/',
      data: {
        'id': idMapa
      },
      dataType: 'json',
      success: function (data) {
        //Define o mapa
        let mapa=JSON.parse(data.mapa)[0].fields;
        let pontoAreas = JSON.parse(data.pontoAreas);
        for(let i=0; i<pontoAreas.length; i++){
          pontoAreas[i]=JSON.parse(pontoAreas[i]);
        }
        let pontoRotas = JSON.parse(data.pontoRotas);
        for(let i=0; i<pontoRotas.length; i++){
          pontoRotas[i]=JSON.parse(pontoRotas[i]);
        }
        setMapa(mapa, JSON.parse(data.pontos), JSON.parse(data.icones), JSON.parse(data.rotas),
                pontoRotas, JSON.parse(data.areas), pontoAreas, 'divMapa', inicio, false);
      }
  });
}

function initMap(){
   carregarMapaInicial();
   setInterval(function(){
      atualizarMapa(map.getCenter());
      console.log('atualizou');
   }, 3000);
}
//Função para exibir o mapa
function setMapa(mapa, pontos, icones, rotas, pontoRotas, areas, pontoAreas, mapId, inicio, reset){
    if(reset){
      //Cria estilo sem Pontos de Interesse
      let removerPOI =[{
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit.station.bus",
        stylers: [{ visibility: "off" }]
      }];
      //Cria o mapa em suas coordenadas iniciais
      map = new google.maps.Map(document.getElementById(mapId), {
        zoom: 16,
        center: inicio
      });
      map.setOptions({styles: removerPOI});
    }else{
      marcadores.forEach(function(item, index){
        let infoMap = infoWindows[index].getMap();
        if(infoMap === null && typeof infoMap === "undefined")
          item.setMap(null);
      });
      rotasArr.forEach(function(item){
        item.setMap(null);
      });
      poligonos.forEach(function(item){
        item.setMap(null);
      });
    }
    marcadores=[];
    rotasArr=[];
    poligonos=[];
    infoWindows=[];
    //Para cada ponto do mapa
		pontos.forEach(function(item, index){
      //Verifica se o ponto é uma marcação e não parte de uma área ou rota
      if(item.fields.idtponto=='P'){
        let iconePonto=null;
				let codIcone=item.fields.codicone;
				for(let i=0; i<icones.length; i++){
          //Salva o icone do ponto
					if(icones[i].pk==codIcone){
						iconePonto=icones[i];
					}
				}
				//Coordenadas do ponto
				let pos = {lat: item.fields.coordy, lng: item.fields.coordx};
				//Cria o marcador no ponto
				let marker = new google.maps.Marker({
					 position: pos,
					 map: map,
				});
				//Se o ponto possui um icone, define esse icone ao marcador
        if(iconePonto!=null)
				    marker.setIcon(imgUrl+'MapFindIt/ImagemIcones/'+iconePonto.pk+'.png');
				let contentString;
				if(item.fields.fotoponto!=""){
					//Se o ponto possui foto
					contentString =
					`<div id="content">
		            	<h1 id="firstHeading" class="firstHeading">${item.fields.nomponto}</h1>
		            	<div id="bodyContent">
		            		<img class="img-responsive" style="margin: 0 auto;" src="${imgUrl}MapFindIt/ImagemPonto/${item.pk}.png">
		            		<p>${item.fields.descponto}</p>
                    <button class="btn btn-default" onClick="escolherIcone(${item.pk});">Escolher Icone</button>
		            	</div>
		            </div>`;
				}else{
					//Se o ponto não possui foto
					contentString =
					`<div id="content">
		            	<h1 id="firstHeading" class="firstHeading">${item.fields.nomponto}</h1>
		            	<div id="bodyContent">
		            		<p>${item.fields.descponto}</p>
                    <div class="centerDiv">
                      <button class="btn btn-default" onClick="escolherIcone(${item.pk});">Escolher Icone</button>
                    </div>
		            	</div>
		            </div>`;
				}
				//Cria a janela de informações do ponto
		    let infowindow = new google.maps.InfoWindow({
		       content: contentString
		    });
				//Evento de exibir a janela ao clicar no ponto
				marker.addListener('click', function() {
		          infowindow.open(map, marker);
        });
        marcadores.push(marker);
        infoWindows.push(infowindow);
			}
    });

		//Para cada rota
		rotas.forEach(function(item, index){
			//Pontos que compõe essa rota
      let pontosRota=pontoRotas[index];
      console.log(pontosRota);
			//Serviço de direções do google
			let directionsService = new google.maps.DirectionsService();
			//Serviço de exibição das rotas
			let directionsDisplay = new google.maps.DirectionsRenderer({
			  polylineOptions: {
					//Cor da rota
			    strokeColor: `rgb(${item.fields.codcor[0]}, ${item.fields.codcor[1]}, ${item.fields.codcor[2]})`,
					//Grossura do traçado
					strokeWeight: 5
				},
				//Remove o indicador de pontos padrão da google
				suppressMarkers: true,
        preserveViewport: true
			});
			//Cor dos pontos de uma rota
			let pinColor = `rgb(${item.fields.codcor[0]},${item.fields.codcor[1]},${item.fields.codcor[2]})`;
			//Para cada ponto cria uma marcacao com a cor da rota, e cria um evento de click para as marcacoes
			for(let x=0; x<pontosRota.length; x++){
				let marker = new google.maps.Marker({
					 position: new google.maps.LatLng(pontosRota[x].fields.idponto[0], pontosRota[x].fields.idponto[1]),
					 map: map,
					 icon: pinSymbol(pinColor)
        });
				let contentString=
					`<div id="content">
		          <h2 id="firstHeading" class="firstHeading">${item.fields.nomerota}</h2>
		          <div id="bodyContent">
		             <p>${item.fields.descrota}</p>
		          </div>
		       </div>`;
		    let infowindow = new google.maps.InfoWindow({
		       content: contentString
		    });
				marker.addListener('click', function() {
		      infowindow.open(map, marker);
        });
        marcadores.push(marker);
        infoWindows.push(infowindow);
			}
			//Array para os pontos do "meio" da rota, sem incluir o primeiro e ultimo
			let waypts=Array();
			for(let x=1; x<pontosRota.length-1; x++){
				waypts.push({location:{lat: pontosRota[x].fields.idponto[0], lng: pontosRota[x].fields.idponto[1]}, stopover:false});
			}
			//Define o mapa da rota
      directionsDisplay.setMap(map);
			let request;
			if(waypts.length>0){
				//Se existem mais de dois pontos
				request = {
					origin: {lat: pontosRota[0].fields.idponto[0], lng: pontosRota[0].fields.idponto[1]},
					destination: {lat: pontosRota[pontosRota.length-1].fields.idponto[0], lng: pontosRota[pontosRota.length-1].fields.idponto[1]},
					waypoints: waypts,
					travelMode: 'DRIVING'
				};
			}else{
				//Se existem apenas dois pontos
				request = {
					origin: {lat: pontosRota[0].fields.idponto[0], lng: pontosRota[0].fields.idponto[1]},
					destination: {lat: pontosRota[pontosRota.length-1].fields.idponto[0], lng: pontosRota[pontosRota.length-1].fields.idponto[1]},
					travelMode: 'DRIVING'
				};
			}
			//Requisita a rota ao servidor da google
			directionsService.route(request, function(response, status) {
			  if (status == 'OK') {
          directionsDisplay.setDirections(response);
          rotasArr.push(directionsDisplay);
			  }
      });
		});
		//Para cada uma das areas criadas
		areas.forEach(function(item, index){
			//Todos os pontos que compoe uma area
			let pontosArea=pontoAreas[index];
			//Array com as posicoes de todos os pontos
			let coords=Array();
			for(let x=0; x<pontosArea.length; x++){
				coords.push({lat: pontosArea[x].fields.idponto[0], lng: pontosArea[x].fields.idponto[1]});
			}
			//Cria um poligono com a cor da area, e seus pontos
			let areaPoligono = new google.maps.Polygon({
          paths: coords,
          strokeColor: `rgb(${item.fields.codcor[0]}, ${item.fields.codcor[1]}, ${item.fields.codcor[2]})`,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: `rgb(${item.fields.codcor[0]}, ${item.fields.codcor[1]}, ${item.fields.codcor[2]})`,
          fillOpacity: 0.5
      });
			//Define o mapa do poligono
      areaPoligono.setMap(map);
			let contentString=
				`<div id="content">
						<h2 id="firstHeading" class="firstHeading">${item.fields.nomarea}</h2>
						<div id="bodyContent">
							 <p>${item.fields.descarea}</p>
						</div>
				 </div>`;
		  //Cria a janela de informacao da area
			let infowindow = new google.maps.InfoWindow({
				 content: contentString
			});
			//Adiciona o evento de click à area para exibir a janela de informacao
			google.maps.event.addListener(areaPoligono, 'click', function (event) {
				infowindow.setPosition(event.latLng);
				infowindow.open(map);
      });
      poligonos.push(areaPoligono);
	  });
}

function iniciarBarraPesquisa(){
  let input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  searchBox.addListener('places_changed', function() {
    let places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    place = places[0];
    if (!place.geometry) {
      console.log("Erro");
      return;
    }
    inserirPonto({'latLng': place.geometry.location});


  });
}