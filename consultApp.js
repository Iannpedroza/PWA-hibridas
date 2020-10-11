let consultas = [];

onload = () => {
  const t = JSON.parse(localStorage.getItem('consultas'));
  if (t) consultas = t;
  if (document.querySelector('#Tela1Title').innerHTML == "Histórico de consultas") {
    mostraConsultas(false);
  } else {
    mostraConsultas(true);
  }
  
  document.querySelector('#inputTipo').oninput = monitoraCampoAdic;
  document.querySelector('#inputAlteraTipo').oninput = monitoraCampoAlt;
  document.querySelector('#inputTipo').onkeypress = (e) => {
    if (e.key == 'Enter') adicionaConsulta();
  };
  document.querySelector('#inputAlteraTipo').onkeypress = (e) => {
    if (e.key == 'Enter') alteraConsulta();
  };

  document.querySelector('#sideCriar').onclick = () => {
    closeNav();
    ativa('tela2');
    document.querySelector('#inputTipo').focus();
  };

  document.querySelector('#sideHistorico').onclick = () => {
    closeNav();
    document.querySelector('#Tela1Title').innerHTML = "Histórico de consultas";
    mostraConsultas(false);
    ativa('tela1');
  };

  document.querySelector('#sideConsultas').onclick = () => {
    closeNav();
    document.querySelector('#Tela1Title').innerHTML = "Próximas consultas";
    mostraConsultas(true);
    ativa('tela1');
  };

  document.querySelector('#btnCanc1').onclick = () => {
    document.querySelector('#inputTipo').value = '';
    ativa('tela1');
  };

  document.querySelector('#btnCanc2').onclick = () => {
    let campo = document.querySelector('#inputAlteraTipo');
    campo.value = '';
    campo.removeAttribute('data-id');
    ativa('tela1');
  };

  document.querySelector('#selectOrder').addEventListener('change', function(){
    if (document.querySelector('#Tela1Title').innerHTML == "Histórico de consultas") {
      mostraConsultas(false);
    } else {
      mostraConsultas(true);
    }
  });

  document.querySelector('#btnInc').onclick = () => {
    adicionaConsulta();
  };

  document.querySelector('#btnAlt').onclick = () => {
    alteraConsulta();
  };

  document.querySelector('#btnDel').onclick = () => {
    apagaConsulta();
  };
};

const mostraConsultas = (consultasFuturas) => {
  var today = new Date();
  var isoDateString = today.toISOString().substring(0,10);
  var consultasAux = (consultasFuturas ? consultas.filter(el => el.data >= isoDateString) : consultas.filter(el => el.data < isoDateString));
  const select = document.querySelector('#selectOrder');
  if (select.value == "closeDate") {
    consultasAux = consultasAux.sort(function compare(a, b) {
      var dateA = new Date(a.data);
      var dateB = new Date(b.data);
      return dateA - dateB;
    });
  } else {
    consultasAux = consultasAux.sort(function compare(a, b) {
      return (a.tipo > b.tipo) ? 1 : ((b.tipo > a.tipo) ? -1 : 0);
    });
  }
  

  const listaDeConsultas = document.querySelector('#listaDeConsultas');
  listaDeConsultas.innerHTML = '';
  consultasAux.forEach((t) => {
    let elemConsulta = document.createElement('li');
    let divValue = t.data.substring(8) + "/" + t.data.substring(5,7) + "/" + t.data.substring(0,4);
    
    elemConsulta.innerHTML = t.tipo + "<div>" + divValue + "</div>";
    elemConsulta.setAttribute('data-id', t.id);
    elemConsulta.onclick = () => {
      let campoTipo = document.querySelector('#inputAlteraTipo');
      let campoMed = document.querySelector('#inputAlteraMedico');
      let campoData = document.querySelector('#inputAlteraDate');
      let campoNotas = document.querySelector('#inputAlteraNotes');
      ativa('tela3');
      campoTipo.value = t.tipo;
      campoMed.value = t.med;
      campoData.value = t.data;
      campoNotas.value = t.nota;
      
      
      campoTipo.setAttribute('data-id', t.id);
      campoTipo.focus();
    };
    listaDeConsultas.appendChild(elemConsulta);
  });
  document.querySelector('#estado').innerText = consultasAux.length;
  if (consultasAux.length > 0) {
    listaDeConsultas.classList.remove('hidden');
    document.querySelector('#blank').classList.add('hidden');
  } else {
    listaDeConsultas.classList.add('hidden');
    document.querySelector('#blank').classList.remove('hidden');
  }
};

const ativa = (comp) => {
  let listaDeTelas = document.querySelectorAll('body > .component');
  listaDeTelas.forEach((c) => c.classList.add('hidden'));
  document.querySelector('#' + comp).classList.remove('hidden');
};

const adicionaConsulta = () => {
  let campoTipo = document.querySelector('#inputTipo');
  let campoData = document.querySelector('#inputDate');
  let campoNota = document.querySelector('#inputNotes');
  let campoMed = document.querySelector('#inputMedico');

  if (campoTipo.value != '' && campoData.value != '') {
    consultas.push({
      id: Math.random().toString().replace('0.', ''),
      tipo: campoTipo.value,
      data: campoData.value,
      nota: campoNota.value,
      med: campoMed.value
    });
    campoTipo.value = '';
    campoData.value = '';
    campoNota.value = '';
    campoMed.value = '';

    ativa('tela1');
    salvaConsultas();
    if (document.querySelector('#Tela1Title').innerHTML == "Histórico de consultas") {
      mostraConsultas(false);
    } else {
      mostraConsultas(true);
    }
  } else {
    alert("Os campos Tipo e Data são obrigatórios.");
  }
};

const monitoraCampoAdic = (e) => {
  let botao = document.querySelector('#btnInc');
  if (e.target.value.length > 0) botao.disabled = false;
  else botao.disabled = true;
};

const alteraConsulta = () => {
  let tipo = document.querySelector('#inputAlteraTipo');
  let medico = document.querySelector('#inputAlteraMedico');
  let data = document.querySelector('#inputAlteraDate');
  let notas = document.querySelector('#inputAlteraNotes');
  let idConsulta = tipo.getAttribute('data-id');
  if (tipo.value != '' && data.value != '') {
    let i = consultas.findIndex((t) => t.id == idConsulta);
    consultas[i].tipo = tipo.value;
    consultas[i].med = medico.value;
    consultas[i].data = data.value;
    consultas[i].nota = notas.value;
    tipo.value = '';
    notas.value = '';
    data.value = '';
    medico.value = '';
    tipo.removeAttribute('data-id');
    ativa('tela1');
    salvaConsultas();
    if (document.querySelector('#Tela1Title').innerHTML == "Histórico de consultas") {
      mostraConsultas(false);
    } else {
      mostraConsultas(true);
    }
  } else {
    alert("Os campos Tipo e Data são obrigatórios.");
  }
};

const apagaConsulta = () => {
  let campo = document.querySelector('#inputAlteraTipo');
  let idConsulta = campo.getAttribute('data-id');
  consultas = consultas.filter((t) => t.id != idConsulta);
  campo.value = '';
  campo.removeAttribute('data-id');
  ativa('tela1');
  salvaConsultas();
  if (document.querySelector('#Tela1Title').innerHTML == "Histórico de consultas") {
    mostraConsultas(false);
  } else {
    mostraConsultas(true);
  }
};

const monitoraCampoAlt = (e) => {
  let botao = document.querySelector('#btnAlt');
  if (e.target.value.length > 0) botao.disabled = false;
  else botao.disabled = true;
};

const salvaConsultas = () => {
  localStorage.setItem('consultas', JSON.stringify(consultas));
};

function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("div-select").style.marginLeft = "150px";
  
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("div-select").style.marginLeft = "";
}
navigator.serviceWorker.register('./consultApp-sw.js');