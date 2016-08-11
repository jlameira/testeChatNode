var websocket;
var message = "";
var colunas = "";
var modalDetalhes = "";
var inicioTable = "";
var fimTable = "";
var dadosTable = "";
var fullTable = "";
var tableModal = "";
var fullModal = "";
var fullDetalhes = "";
var alarmCount = 0;
var alarmesAntigos = [];
//cria um objeto do tipo date
var data = new Date();
var registroCorrente;
var list = "";
var countComent = 0;


loadThread();

function init() {
	outputTable = document.getElementById('lista');
	outputDetalhes = document.getElementById('detalhes');
	alarmCount = 0;
	montaTable();
	
}

function loadThread() {
	// var cookie = getCookie('JSESSIONIDSSO');
	var enderecoServidor = location.href.split('/');
	// var nrPolUsuarioLogado = document.getElementById('form:nrPolUsuarioLogado').value;
	
	if (window.location.protocol != "https:"){
		var wsUri = "ws://" + enderecoServidor[2];
	} else {
		var wsUri = "wss://" + enderecoServidor[2];
	}
	websocket = new WebSocket("ws://localhost:8087/");
	websocket.onmessage = function(evt) {
		var dados = JSON.parse(evt.data);
		atualizaTable(dados);
		getMaskHelios();
	};

	websocket.onerror = function(evt) {
		websocket.close();
	};
	
}

function excluiMonitoramento(){
	if (confirm('Confirma a exclusão do registro?')) {
		websocket.close();
		loadThread();
	}else{
		return false;
	}
}

function getCookie(name) {
	var value = '; ' + document.cookie;
	var parts = value.split('; ' + name + '=');
	if (parts.length == 2)
		return parts.pop().split(';').shift();
}

function montaTable() {
	inicioTable = '<table id="mainTab"  class="t1 splash">';
	fimTable = '</table>';
	outputTable.innerHTML = inicioTable.concat(fimTable);
}

function marcaSelecao(o){
	o.className = "at";
}


function salvaComentario(registro, idVeiculo) {
	var comentario = document.getElementById('c'+ registro);
	document.getElementById("form:idVeiculoComentario").value = idVeiculo;
	document.getElementById("form:textoComentario").value = comentario.value;
	
	document.getElementById("form:salvarComentario").click();
	var user = id("form:usuarioLogado");
	var data2 = new Date()
	data2 = exibeDataHora(data2);

	var usuarioLogado = document.createElement('p'); 
	usuarioLogado.setAttribute('style', 'font-weight: bold;');
	usuarioLogado.textContent = user.value +' '+data2;
	var divcomentarios = document.createElement('p'); 
	divcomentarios.textContent =  comentario.value ;
	comentario.value = "";
    id("comm"+registro).appendChild(usuarioLogado);
   list =  id("comm"+registro).appendChild(divcomentarios);
   var detalhes = document.getElementById('det'+registro);  
   
   var numCount = document.getElementById('numb'+registro).innerHTML;
   numCount ++;
   document.getElementById('numb'+registro).innerHTML = numCount;
  
	
	
	
	
	
	comentario.focus();
//	fecharDetalhes('det'+registro);
}

function exibeDataHora(data){

	  
	   
	   // obtem o dia, mes e ano
	   dia = data.getDate();
	   mes = data.getMonth() + 1;
	   ano = data.getFullYear();
	   
	   //obtem as horas, minutos e segundos
	   horas = data.getHours();
	   minutos = data.getMinutes();
	   segundos = data.getSeconds();
	   
	   //converte as horas, minutos e segundos para string
	   str_horas = new String(horas);
	   str_minutos = new String(minutos);
	   str_segundos = new String(segundos);
	   
	   //se tiver menos que 2 digitos, acrescenta o 0
	   if (str_horas.length < 2)
	      str_horas = 0 + str_horas;
	   if (str_minutos.length < 2)
	      str_minutos = 0 + str_minutos;
	   if (str_segundos.length < 2)
	      str_segundos = 0 + str_segundos;
	   
	   //converte o dia e o mes para string
	   str_dia = new String(dia);
	   str_mes = new String(mes);
	   
	   //se tiver menos que 2 digitos, acrescenta o 0
	   if (str_dia.length < 2) 
	      str_dia = 0 + str_dia;
	   if (str_mes.length < 2) 
	      str_mes = 0 + str_mes;
	   
	   //cria a string que sera exibida na div
	   data = str_dia + '/' + str_mes + '/' + ano + ' - ' + str_horas + ':' + str_minutos + ':' + str_segundos;
	   
	  	   return data;
	}

function id(id) {
    return document.getElementById(id);
}

function fotoMaior(a) {
    var jm = document.getElementById('fotoPlaca');
    document.getElementById('fotoPlacaMaior').src = a.src;
    jm.className = 'jm foto-maior';
} 

function fecharFoto() {	
    var jm = document.getElementById('fotoPlaca');
    document.getElementById('fotoPlacaMaior').src = "";
    jm.className = 'jm foto-maior no';
} 

function tocarAlarme() { 
	if (alarmCount == 0){
		document.getElementById("alarmeSonoro").innerHTML='<audio autoplay="autoplay" loop="true"><source src="/helios/resources/sound/alarm.mp3" type="audio/mpeg" /><source src="/helios/resources/sound/alarm.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="/helios/resources/sound/alarm.mp3" /></audio>';
	}
    alarmCount++;
}

function incrementaMonitoramento(monitoramento){
	document.getElementById("quantMonitoramento"+monitoramento.id).className = 'n-msg pulso';
	
	var quantidade = parseInt(document.getElementById("quantMonitoramento"+monitoramento.id).innerHTML);
	
	
	document.getElementById("quantMonitoramento"+monitoramento.id).innerHTML = quantidade + 1;
}

function pararAlarme(registro, idMonitoramento) {
	alarmesAntigos.push(registro);
	alarmCount--;
	if(alarmCount <= 0){
		document.getElementById("alarmeSonoro").innerHTML='';
		document.getElementById("quantMonitoramento"+idMonitoramento).className = 'n-msg';
		alarmCount = 0;
	}
}

function mostraDetalhes(e, registro) {
	
	var pai = document.getElementById("detalhes");
	for(var i = 0; i < pai.children.length; i++){
	    if(pai.children[i].className == "jm") {
	    	pai.children[i].className = "no";
		}	
	}
	
	
    var jm = document.getElementById(registro),
        b = document.documentElement;
    jm.style.top = (e.clientY+b.scrollTop)+'px';
    jm.style.left = e.clientX +'px';
    jm.className = 'jm'
    document.getElementById('detalhes').className="";
}

function fecharDetalhes(registro) {
    document.getElementById(registro).className = "no";
    document.getElementById('detalhes').className = "jm no";
}

function atualizaTable(dados) {
	
	var monitoramento = dados.monitoramento;
	var veiculo = dados.Response.Data[0].Event[0].EventData[0];
	var camera = dados.Response.Data[0].Event[0].ObjectData[0];

	colunas = '<tr id="tab'+ veiculo.RecordNumber + '">'
			+ '<td class="thumb-foto">'
			+ '<img class="pointer"  src="http://'+dados.servidor+':8601/Interface/LPR/GetRecordImage?RecordNumber='+veiculo.RecordNumber+'&AuthUser='+dados.AuthUser+'&AuthPass='+dados.AuthPass+'"/></td>'
			+ '<td class="placa pointer"><b><span class="placa-input"> ' + veiculo.Plate + '</span></b></td>'
			+ '<td class="tam-hora pointer" >' + veiculo.Timestamp + '</td>'
			+ '<td class="pointer"  >' + camera.Name + '<span class="marc">'+ dados.servidor +'</span> <br />' + '<span class="tc">' +  + '</span></td>'
			+ '<td class="tam-ic pointer"><a href="javascript:pararAlarme(\'vol'+veiculo.RecordNumber+'\', \''+ 1 +'\')" id="vol'+veiculo.RecordNumber+'" class="volume ic" onclick="this.className=\'no\'"></a></td>'
			+ '<td class="tam-ic"><span class="' + '"></span></td>'
			+ '<td class="tam-ic"><a href="javascript:dispensarDeteccao(\''+ veiculo.RecordNumber +'\', \''+ 1 +'\', \''+ veiculo.Plate +'\')" class="ic ex" title="Dispensar"></a></td></tr>';;
	
	var table = $('#mainTab');
	table.prepend(colunas);

	fullTable = inicioTable.concat(colunas.concat(document.getElementById('mainTab').innerHTML)).concat(fimTable);
	// outputTable.innerHTML = fullTable;
	montaModalDetalhes(dados);
	tocarAlarme();
	incrementaMonitoramento(monitoramento);

	for (var index = 0; index < alarmesAntigos.length; ++index) {
		document.getElementById(alarmesAntigos[index]).className = "no";
	}
	return table;

}

function dispensarDeteccao(registro, monitoramentoId, placa) {
	pararAlarme('vol'+registro, monitoramentoId);
	alarmeAntigoIndex = alarmesAntigos.indexOf(registro);
	if (alarmeAntigoIndex > -1) {
		echo(alarmesAntigos[alarmeAntigoIndex]);
		document.getElementById(alarmesAntigos[alarmeAntigoIndex]).remove();
	}
	
	document.getElementById('tab'+registro).remove();
	
	document.getElementById("form:registroDispensar").value = registro;
	document.getElementById("form:placaDispensar").value = placa;
	document.getElementById("form:monitoramentoDispensar").value = monitoramentoId;
	
	document.getElementById("form:dispensarDeteccao").click();
	
	websocket.send(registro);
}

function formatDate(date) {
	  var hours = date.getHours();
	  hours = hours < 10 ? '0'+hours : hours;
	  var minutes = date.getMinutes();
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes;
	  return date.getDate() + "/" + date.getMonth()+1 + "/" +  + date.getFullYear() + "  " + strTime;
}

function montaModalDetalhes(dados) {
	registroCorrente = dados;
	var comentarios = "";
	var monitoramento = dados.monitoramento;
	var veiculo = dados.veiculoReconhecido;
	if (typeof(dados.monitoramento.veiculoMonitorado.comentarios) != "undefined"){
		for (var index = 0; index < dados.monitoramento.veiculoMonitorado.comentarios.length; ++index) {
			var dataComentario = new Date(dados.monitoramento.veiculoMonitorado.comentarios[index].data);
			comentarios = comentarios.concat('<p><b>' + dados.monitoramento.veiculoMonitorado.comentarios[index].autorNome 
					+ " " + formatDate(dataComentario) + '</b><br />' + dados.monitoramento.veiculoMonitorado.comentarios[index].texto + '</p>')
		}
	}
	var detalhes = 
			'<div id="det'+ veiculo.registro + '" class="no">'
				+'<div class="jm foto-maior" id="fotoPlaca">'
					+ '<a onclick="fecharDetalhes(\'det' + veiculo.registro + '\')" class="ic fe" title="Fechar"></a>'
						+ '<img id="fotoPlacaMaior" src="data:image/png;base64,'+veiculo.imagem+'">'
						+'<div class="su separ">'
							+'<span class="relat">'
								+'<a id="linkDetec' + veiculo.registro + '" class="ver fonte at" onclick="abaDetec(this.id,' + veiculo.registro +')"'
								+'>Detectado</a>'
								+'<a id="linkComent' + veiculo.registro + '" class="info fonte" onclick="abaDetec(this.id, '+veiculo.registro+' )"' 
								+'>Coment\u00e1rios (<span id="numb'+veiculo.registro+'">'+dados.monitoramento.veiculoMonitorado.comentarios.length+' </span>)</a></span>'
							
						+'</div>  <!-- fecha div separar -->'
					+'<div id="abaDetec'+ veiculo.registro + '" class="ma">'
						+'<div class="detec">'
							+ '<h5 class="placa">Monitorada<b>' + dados.monitoramento.veiculoMonitorado.placa + '</b></h5>'
							+ '<h5 class="placa">Detectada<b>' + veiculo.placa + '</b></h5>'
						+'</div>'
						+ '<table class="t2">'
							+ '<tbody><tr><th>Endere\u00E7o</th><td>'
							+ veiculo.camera.endereco + '</td></tr>'
							+ '<tr><th>Tipo</th><td>'
							+ monitoramento.tipo + '</td></tr>'
							+ '<tr><th>Modelo</th><td>'
							+ monitoramento.veiculoMonitorado.modelo + '</td></tr>'
							+ '<tr><th>Cor</th><td>'
							+ monitoramento.veiculoMonitorado.cor + '</td></tr>'
							+ '</tbody>'
						+'</table>'
					+'</div>  <!-- fecha div abaDetect -->'
					+'<div id="abaComent'+ veiculo.registro + '" class="ma no">'
						+ '<h5>Coment\u00e1rios</h5>'
						+ '<div id="comm' + veiculo.registro + '" class="rol">' 
						+ comentarios
						+ '</div><fieldset>'
						+ '<div><textarea id="c'+veiculo.registro+'" class="tam-max"></textarea></div>'
						+ '</fieldset>'
					+ '<div class="su"><input type="button" value="Salvar" id="s'+ veiculo.registro +'" onclick="salvaComentario(\''+ veiculo.registro +'\', \'' + monitoramento.veiculoMonitorado.id + '\')" ></input>'
					+ '<input type="button" value="Cancelar" onclick="fecharDetalhes(\'det' + veiculo.registro + '\');" ></input></div>'
					+'</div><!-- fecha div abaComent -->'
				+ '</div> <!-- fecha div fotoPlaca -->'
			+ '</div>  <!-- fecha div det -->';
	
	var det = $('#detalhes');
	det.append(detalhes);
//	fullDetalhes = detalhes.concat(fullDetalhes);
	
//	outputDetalhes.innerHTML = fullDetalhes;
	//outputDetalhes.childNodes[0].nodeValue = null;
			
}

function montarModalVeiculosDoDia(e,dados){
	if(document.getElementById('det'+dados.veiculoReconhecido.registro) == null){
		montaModalDetalhes(dados);
		mostraDetalhes(e,'det'+dados.veiculoReconhecido.registro);		
	}else{
		mostraDetalhes(e,'det'+dados.veiculoReconhecido.registro);	
	}
}

function abaDetec(a,v) {
	var id = a;
	
    if (id == "linkComent"+v ) {
        document.getElementById('linkDetec'+v).classList.remove('at');
        document.getElementById('linkComent'+v).classList.add('at');
        document.getElementById('abaDetec'+v).classList.add('no');
        document.getElementById('abaComent'+v).classList.remove('no');
    } else {
        document.getElementById('linkDetec'+v).classList.add('at');
        document.getElementById('linkComent'+v).classList.remove('at');
        document.getElementById('abaDetec'+v).classList.remove('no');
        document.getElementById('abaComent'+v).classList.add('no');
    } 
}

window.addEventListener('load', init, false);