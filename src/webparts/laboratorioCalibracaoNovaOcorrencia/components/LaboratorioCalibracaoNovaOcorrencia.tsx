import * as React from 'react';
import styles from './LaboratorioCalibracaoNovaOcorrencia.module.scss';
import { ILaboratorioCalibracaoNovaOcorrenciaProps } from './ILaboratorioCalibracaoNovaOcorrenciaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import "bootstrap";
import { Web } from 'sp-pnp-js';
import { faArrowLeftRotate } from '@fortawesome/free-solid-svg-icons';
import * as Moment from 'moment';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");
require("../../../../css/jPages.css");

require("../../../../js/jquery-1.8.2.min.js");
require("../../../../js/highlight.pack.js");
require("../../../../js/tabifier.js");

var _web;
var _idFilial;
var _userName;
var _userEmail;
var _grupos = [];
var _idInstrumento;
var _cac;
var _numeroCertificado;
var _dataAfericao;
var _dataVencimento;
var _tecnico;
var _linha = "";


export interface IReactGetItemsState {
  itemsTipoOcorrencia: [
    {
      "ID": any,
      "Title": any,
    }],
  itemsFilial: [
    {
      "ID": any,
      "Title": any,
    }],



}


export default class LaboratorioCalibracaoNovaOcorrencia extends React.Component<ILaboratorioCalibracaoNovaOcorrenciaProps, IReactGetItemsState> {



  public constructor(props: ILaboratorioCalibracaoNovaOcorrenciaProps, state: IReactGetItemsState) {
    super(props);
    this.state = {
      itemsTipoOcorrencia: [
        {
          "ID": "",
          "Title": "",
        }],
      itemsFilial: [
        {
          "ID": "",
          "Title": "",
        }],


    };
  }

  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    $("#conteudo_grid").hide();

    _web.currentUser.get().then(f => {

      console.log("f", f);
      _userName = f.Title;
      _userEmail = f.Email;
      var id = f.Id;

      console.log("_userName", _userName);
      console.log("_userEmail", _userEmail);

      jQuery("#txtUserName").html(_userName);

      var grupos = [];

      jQuery.ajax({
        url: `${this.props.siteurl}/_api/web/GetUserById(${id})/Groups`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        async: false,
        success: async function (resultData) {

          console.log("resultDataGrupo", resultData);

          if (resultData.d.results.length > 0) {

            for (var i = 0; i < resultData.d.results.length; i++) {

              grupos.push(resultData.d.results[i].Title);

            }

          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }

      })

      console.log("grupos", grupos);
      _grupos = grupos;


    });

    jQuery("#txtTecnico").prop("disabled", true);

    jQuery('.certificado').hide();
    jQuery('.transferirCACoutraFilial').hide();
    jQuery('.modificarTecnicoCAC').hide();

    document
      .getElementById("btnBuscarTecnico")
      .addEventListener("click", (e: Event) => this.buscarTecnico());

    document
      .getElementById("btnConfirmarCriarOcorrencia")
      .addEventListener("click", (e: Event) => this.modalConfirmar());
    /*
        document
          .getElementById("btnConfirmarCriarOcorrencia")
          .addEventListener("click", (e: Event) => this.criarOcorrencia());
    */
    document
      .getElementById("btnCriarOcorrencia")
      .addEventListener("click", (e: Event) => this.criarOcorrencia());

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());


    this.handler();

  }


  public render(): React.ReactElement<ILaboratorioCalibracaoNovaOcorrenciaProps> {
    return (


      <><div id="container">

        <div className="form-group">
          <label htmlFor="txtNumero">Número</label>
          <input style={{ "width": "300px" }} type="number" className="form-control" id="txtNumero" />
        </div>

        <div className="form-group">
          <label htmlFor="txtCAC">CAC</label><span className="required"> *</span>
          <input style={{ "width": "300px" }} type="number" className="form-control" id="txtCAC" />
        </div>

        <div className="form-group">
          <label htmlFor="ddlTipoOcorrencia">Tipo de ocorrência</label><span className="required"> *</span>
          <select id="ddlTipoOcorrencia" className="form-control" style={{ "width": "300px" }} onChange={(e) => this.mostrarCampos()}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsTipoOcorrencia.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="txtObservacao">Observação</label>
          <textarea id='txtObservacao' className="form-control" rows={3} required></textarea>
        </div>

        <div className="form-group certificado">
          <label htmlFor="nroNumeroCertificado">Número do Certificado</label><span className="required"> *</span>
          <input type="text" style={{ "width": "300px" }} className="form-control" id="nroNumeroCertificado" />
        </div>

        <div className="form-group certificado">
          <label htmlFor="dtDataAfericao">Data de aferição</label><span className="required"> *</span>
          <DatePicker style={{ "width": "300px" }} formatDate={this.onFormatDate} className="datePicker" id='dtDataAfericao' />
        </div>

        <div className="form-group certificado">
          <label htmlFor="dtDataVencimento">Vencimento</label><span className="required"> *</span>
          <DatePicker style={{ "width": "300px" }} minDate={new Date()} formatDate={this.onFormatDate} className="datePicker" id='dtDataVencimento' />
        </div>

        <div className="form-group transferirCACoutraFilial">
          <label htmlFor="ddlFilial">Enviar para filial</label><span className="required"> *</span>
          <select id="ddlFilial" className="form-control" style={{ "width": "300px" }}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsFilial.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>
              );
            })}
          </select>
        </div>

        <div className="form-group modificarTecnicoCAC">
          <label htmlFor="txtTecnico">Nome Técnico</label><span className="required"> *</span>
          <input type="text" className="form-control" id="txtTecnico" />
          <br></br><button id='btnBuscarTecnico' type="button" className="btn btn-info btn-sm">Selecionar técnico</button>
        </div>

        <div className="form-group modificarTecnicoCAC">

          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="checkPermitirTecnicoEmBranco" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Permitir técnico em branco
            </label>
          </div>
        </div>





        <div className="form-group hide">
          <label htmlFor="txtTecnicoCodTecnico">Código Técnico</label>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoCodTecnico" />
        </div>

        <div className="form-group hide">
          <label htmlFor="txtTecnicoCodFilial">Código Filial</label>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoCodFilial" />
        </div>

        <div className="form-group hide">
          <label htmlFor="txtTecnicoCargo">Cargo</label>
          <input type="text" className="form-control" id="txtTecnicoCargo" />
        </div>


        <div className="form-group hide">
          <label htmlFor="txtTecnicoCodEmitente">COD Emitente</label>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoCodEmitente" />
        </div>

        <div className="form-group hide" >
          <label htmlFor="txtTecnicoEstabelecimento">COD Estabelicmento</label>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoEstabelecimento" />
        </div>


        <div className="modal fade bd-example-modal-lg" id="modalTecnicos" tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Selecionar técnico</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div id="conteudo_grid">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-light ">
                      <tr>
                        <th>CODIGO TEC</th>
                        <th>COD FILIAL</th>
                        <th>NOME TEC</th>
                        <th>CARGO</th>
                        <th>SETOR</th>
                        <th>COD ESTAB</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody id="conteudoTabela">
                    </tbody>
                  </table>
                </div>
                <hr />
                <div id="holder" className="holder">
                </div>
              </div>

              <div id='conteudoCarregando' className='text-center'>
                <br></br>
                <button className="btn btn-primary" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  &nbsp;Carregando...aguarde!
                </button>
                <br></br><br></br>
              </div>


            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Ocorrência cadastrada com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente criar a Ocorrência?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCriarOcorrencia" type="button" className="btn btn-primary">Criar</button>
              </div>
            </div>
          </div>
        </div>

        <br></br>

        <div className="text-right">
          <button id="btnConfirmarCriarOcorrencia" className="btn btn-success" >Criar Ocorrência</button>
        </div>


      </div>



      </>


    );



    function AlertMe() {

      alert("You have clicked Alert!");
    }
  }


  protected handler() {


    var reactHandlerTipoOcorrencia = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('TipoDeOcorrencia')/items?$top=50&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerTipoOcorrencia.setState({
          itemsTipoOcorrencia: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactHandlerFilial = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Filial')/items?$top=50&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerFilial.setState({
          itemsFilial: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactHandlerRepresentante = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Tecnicos')/items?$top=4999&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        jQuery('#txtCountProposta').html(resultData.d.results.length);
        reactHandlerRepresentante.setState({
          //itemsTecnicos: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    // this.carregaTecnicos();


  }

  private onFormatDate = (date: Date): string => {
    //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  };



  private mostrarCampos = () => {

    var tipoOcorrencia = $('#ddlTipoOcorrencia option:selected').text();

    console.log(tipoOcorrencia);

    if (tipoOcorrencia == "Certificado") {

      jQuery('.certificado').show();

    } else {

      jQuery('.certificado').hide();
    }

    if (tipoOcorrencia == "Transferir CAC para outra Filial") {

      jQuery('.transferirCACoutraFilial').show();

    } else {

      jQuery('.transferirCACoutraFilial').hide();
    }

    if (tipoOcorrencia == "Modificar Tecnico do CAC") {

      jQuery('.modificarTecnicoCAC').show();

    } else {

      jQuery('.modificarTecnicoCAC').hide();
    }



  }

  private buscarTecnico = () => {

    //jQuery("#btnBuscarTecnico").prop("disabled", true);
    jQuery("#modalTecnicos").modal({ backdrop: 'static', keyboard: false });

    setTimeout(() => {

      this.carregaTecnicos();

    }, 1000);


  }

  protected modalConfirmar() {

    var tipoOcorrencia = jQuery("#ddlTipoOcorrencia").val();
    var txtTipoOcorrencia = $('#ddlTipoOcorrencia option:selected').text();
    var cac = jQuery("#txtCAC").val();
    var tecnico = jQuery("#txtTecnico").val();
    var dataAfericao = jQuery("#dtDataAfericao-label").val();
    var dataVencimento = jQuery("#dtDataVencimento-label").val();
    var numeroCertificado = jQuery("#nroNumeroCertificado").val();
    var filial = jQuery("#ddlFilial").val();

    if (cac == "") {

      alert("Forneça o CAC");
      return false;

    } else {

      jQuery.ajax({

        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Instrumento')/items?$top=4999&$select=ID,Title,Filial/ID,Status/Title&$expand=Filial,Status&$filter=Title eq '` + cac + `'`,
        type: "GET",
        async: false,
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: async (resultData) => {
          if (resultData.d.results.length > 0) {

            if (tipoOcorrencia == "0") {

              alert("Escolha o tipo de ocorrência");
              return false;

            }

            else if (txtTipoOcorrencia == "Modificar Tecnico do CAC") {

              if (!jQuery('#checkPermitirTecnicoEmBranco').is(":checked")) {

                if (tecnico == "") {
                  alert("Escolha o técnico");
                  return false;
                }

              }

            }

            else if (txtTipoOcorrencia == "Certificado") {

              if (numeroCertificado == "") {
                alert("Forneça o número do certificado");
                return false;
              }


              if (dataAfericao == "") {
                alert("Forneça a data de aferição");
                return false;
              }

              if (dataVencimento == "") {
                alert("Forneça a data de vencimento");
                return false;
              }

            }

            else if (txtTipoOcorrencia == "Transferir CAC para outra Filial") {

              if (filial == "0") {
                alert("Escolha a filial");
                return false;

              }

            }


            for (var i = 0; i < resultData.d.results.length; i++) {

              // console.log(resultData.d.results[i].Title);
              _idInstrumento = resultData.d.results[i].ID;
              _idFilial = resultData.d.results[i].Filial.ID;
              var statusInstrumento = resultData.d.results[i].Status.Title;

              //console.log("statusInstrumento", statusInstrumento);

              if (tipoOcorrencia == "Cancelar Ocorrencia") {

                if ((statusInstrumento != "Transferido para Filial") && (statusInstrumento != "Enviado para calibração") && (statusInstrumento != "Obsoleto")) {

                  alert("Você só pode cancelar a Ocorrencia se ele estiver no Status: Transferido para Filial, Enviado para calibração ou Obsoleto!");
                  return false;

                }

              }

              if (tipoOcorrencia == "Modificar CAC para Obsoleto") {

                if ((statusInstrumento != "Em Uso") && (statusInstrumento != "EM ESTOQUE")) {

                  alert("Você só pode Modificar CAC para Obsoleto se o instrumento estiver no Status: Em uso ou Em estoque!");
                  return false;

                }

              }


              if (tipoOcorrencia == "Modificar Tecnico do CAC") {

                if ((statusInstrumento != "Em Uso") && (statusInstrumento != "EM ESTOQUE")) {

                  alert("Você só pode Modificar Tecnico do CAC se o instrumento estiver no Status: Em uso ou Em estoque!");
                  return false;

                }

              }


              jQuery.ajax({

                url: `${this.props.siteurl}/_api/web/lists/getbytitle('ResponsavelXFilial')/items?$top=4999&$select=ID,Title,Responsavel/Title&$expand=Responsavel&$filter=Filial/Id eq '` + _idFilial + `'`,
                type: "GET",
                async: false,
                headers: { 'Accept': 'application/json; odata=verbose;' },
                success: async (resultData) => {

                  if (resultData.d.results.length > 0) {

                    var ehResponsavel = false;

                    var responsavelTitle = resultData.d.results[i].Responsavel.Title;

                    console.log("_grupos", _grupos);

                    if (_grupos.indexOf("Proprietários do Calibração") == -1) {

                      console.log("Entrou verificação 1");
                      alert("Você não é responsavel pela Filial!");
                      return false;

                    } else ehResponsavel = true;

                    if (!ehResponsavel) {

                      console.log("Entrou verificação 2");

                      if (responsavelTitle != _userName) {

                        console.log("Entrou verificação 3");

                        alert("Você não é responsavel pela Filial!");
                        return false;

                      } else ehResponsavel = true;

                    }

                    if (ehResponsavel) jQuery("#modalConfirmar").modal({ backdrop: 'static', keyboard: false });

                  } else {

                    alert("Filial não encontrada!");
                    return false;
                  }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log(textStatus);
                }

              });


            }





          } else {
            alert("CAC não encontrado!");
            return false;
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });


    }


  }

  protected async criarOcorrencia() {

    jQuery("#btnCriarOcorrencia").prop("disabled", true);

    var numero = jQuery("#txtNumero").val();

    if (numero == "") {

      numero = Moment().format("YYYYMMDDhhmmssSS");

    }

    var cac = jQuery("#txtCAC").val();
    _cac = cac;
    var tipoOcorrencia = jQuery("#ddlTipoOcorrencia").val();
    var txtObservacao = jQuery("#txtObservacao").val();
    var numeroCertificado = jQuery("#nroNumeroCertificado").val();

    _numeroCertificado = numeroCertificado;

    var dataAfericao = "" + jQuery("#dtDataAfericao-label").val() + "";
    var dataAfericaoDia = dataAfericao.substring(0, 2);
    var dataAfericaoMes = dataAfericao.substring(3, 5);
    var dataAfericaoAno = dataAfericao.substring(6, 10);
    var formdataAfericao = dataAfericaoAno + "-" + dataAfericaoMes + "-" + dataAfericaoDia;

    if (formdataAfericao == "--") formdataAfericao = null;

    _dataAfericao = formdataAfericao;

    var dataVencimento = "" + jQuery("#dtDataVencimento-label").val() + "";
    var dataVencimentoDia = dataVencimento.substring(0, 2);
    var dataVencimentoMes = dataVencimento.substring(3, 5);
    var dataVencimentoAno = dataVencimento.substring(6, 10);
    var formdataVencimento = dataVencimentoAno + "-" + dataVencimentoMes + "-" + dataVencimentoDia;

    if (formdataVencimento == "--") formdataVencimento = null;

    _dataVencimento = formdataVencimento;

    var filial = jQuery("#ddlFilial").val();
    if (filial == "0") filial = null;

    var tecnico = jQuery("#txtTecnico").val();
    _tecnico = tecnico;
    //if (tecnico == "0") tecnico = null;

    var tecnicoCodTecnico = jQuery("#txtTecnicoCodTecnico").val();
    var tecnicoCodFilial = jQuery("#txtTecnicoCodFilial").val();
    var tecnicoCargo = jQuery("#txtTecnicoCargo").val();
    var tecnicoCodEmitente = jQuery("#txtTecnicoCodEmitente").val();
    var tecnicoEstabelecimento = jQuery("#txtTecnicoEstabelecimento").val();

    var observacao = jQuery("#txtObservacao").val();

    // console.log("numero", numero);
    // console.log("cac", cac);
    //  console.log("tipoOcorrencia", tipoOcorrencia);
    //  console.log("txtObservacao", txtObservacao);
    //  console.log("numeroCertificado", numeroCertificado);
    //  console.log("formdataAfericao", formdataAfericao);
    // console.log("formdataVencimento", formdataVencimento);
    //   console.log("filial", filial);
    //  console.log("tecnico", tecnico);
    //  console.log("tecnicoCodTecnico", tecnicoCodTecnico);
    //  console.log("tecnicoCodFilial", tecnicoCodFilial);
    //  console.log("tecnicoCargo", tecnicoCargo);
    //  console.log("tecnicoCodEmitente", tecnicoCodEmitente);
    //  console.log("tecnicoEstabelecimento", tecnicoEstabelecimento);

    await _web.lists
      .getByTitle("Ocorrencia")
      .items.add({
        Title: numero,
        CAC: cac,
        TipoDeOcorrenciaId: tipoOcorrencia,
        Obs: txtObservacao,
        nrCertificado: numeroCertificado,
        DataAfericao: formdataAfericao,
        Vencimento: formdataVencimento,
        FilialFinalId: filial,
        TecInicial_x003a_codigo_tec: tecnicoCodTecnico,
        TecInicial: tecnico,
        TecInicial_x003a_cod_filial: tecnicoCodFilial,
        TecInicial_x003a_Cargo: tecnicoCargo,
        TecInicial_x003a_cod_emitente: tecnicoCodEmitente,
        TecInicial_x003a_cod_estab: tecnicoEstabelecimento
      })
      .then(async response => {

        var tipoOcorrencia = $('#ddlTipoOcorrencia option:selected').text();

        if (tipoOcorrencia == "Certificado") {

          await _web.lists
            .getByTitle("Instrumento")
            .items.getById(_idInstrumento).update({
              nrCertificado: _numeroCertificado,
              DataAfericao: _dataAfericao,
              Vencimento: _dataVencimento,
              Observacao: observacao
            })
            .then(async response => {

              console.log("gravou!!");
              jQuery("#modalConfirmar").modal('hide');
              jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

            })

        }

        else if (tipoOcorrencia == "Modificar CAC para Obsoleto") {

          jQuery.ajax({
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('Status')/items?$top=1&$select=ID,Title&$filter=Title eq 'Obsoleto'`,
            type: "GET",
            headers: { 'Accept': 'application/json; odata=verbose;' },
            success: async function (resultData) {

              if (resultData.d.results.length > 0) {

                for (var i = 0; i < resultData.d.results.length; i++) {

                  var statusId = resultData.d.results[i].ID;

                  await _web.lists
                    .getByTitle("Instrumento")
                    .items.getById(_idInstrumento).update({
                      StatusId: statusId,
                      Observacao: observacao
                    })
                    .then(async response => {


                      await _web.lists
                        .getByTitle("Instrumento")
                        .items.getById(_idInstrumento).update({
                          StatusId: statusId,
                        })
                        .then(async response => {

                          await _web.lists
                            .getByTitle("HistoricoInstrumento")
                            .items.add({
                              Title: cac,
                              StatusId: statusId,
                            })
                            .then(async response => {

                              console.log("gravou!!");
                              jQuery("#modalConfirmar").modal('hide');
                              jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });
                            })


                        })


                    })

                }

              }

            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR.responseText);
            }
          });


        }

        else if (tipoOcorrencia == "Modificar Tecnico do CAC") {

          var url = "";

          if (jQuery('#checkPermitirTecnicoEmBranco').is(":checked")) {

            url = `${this.props.siteurl}/_api/web/lists/getbytitle('Status')/items?$top=1&$select=ID,Title&$filter=Title eq 'EM ESTOQUE'`;

          } else {

            url = `${this.props.siteurl}/_api/web/lists/getbytitle('Status')/items?$top=1&$select=ID,Title&$filter=Title eq 'Em Uso'`;

          }

          jQuery.ajax({
            url: url,
            type: "GET",
            headers: { 'Accept': 'application/json; odata=verbose;' },
            success: async function (resultData) {

              if (resultData.d.results.length > 0) {

                for (var i = 0; i < resultData.d.results.length; i++) {

                  var statusId = resultData.d.results[i].ID;

                  await _web.lists
                    .getByTitle("Instrumento")
                    .items.getById(_idInstrumento).update({
                      StatusId: statusId,
                      Tecnico: _tecnico,
                      Observacao: observacao
                    })
                    .then(async response => {

                      await _web.lists
                        .getByTitle("HistoricoInstrumento")
                        .items.add({
                          Title: cac,
                          StatusId: statusId,
                        })
                        .then(async response => {

                          console.log("gravou!!");
                          jQuery("#modalConfirmar").modal('hide');
                          jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });
                        })

                    })

                }

              }

            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR.responseText);
            }
          });


        }

        else if (tipoOcorrencia == "Reparo") {

          jQuery.ajax({
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('Status')/items?$top=1&$select=ID,Title&$filter=Title eq 'Enviado para calibração'`,
            type: "GET",
            headers: { 'Accept': 'application/json; odata=verbose;' },
            success: async function (resultData) {

              if (resultData.d.results.length > 0) {

                for (var i = 0; i < resultData.d.results.length; i++) {

                  var statusId = resultData.d.results[i].ID;

                  await _web.lists
                    .getByTitle("Instrumento")
                    .items.getById(_idInstrumento).update({
                      StatusId: statusId,
                      Observacao: observacao
                    })
                    .then(async response => {

                      await _web.lists
                        .getByTitle("HistoricoInstrumento")
                        .items.add({
                          Title: cac,
                          StatusId: statusId,
                        })
                        .then(async response => {

                          console.log("gravou!!");
                          jQuery("#modalConfirmar").modal('hide');
                          jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });
                        })

                    })

                }

              }

            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR.responseText);
            }
          });
        }

        else if (tipoOcorrencia == "Transferir CAC para outra Filial") {

          jQuery.ajax({
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('Status')/items?$top=1&$select=ID,Title&$filter=Title eq 'EM ESTOQUE'`,
            type: "GET",
            headers: { 'Accept': 'application/json; odata=verbose;' },
            success: async function (resultData) {

              if (resultData.d.results.length > 0) {

                for (var i = 0; i < resultData.d.results.length; i++) {

                  var statusId = resultData.d.results[i].ID;

                  console.log("filial", filial);

                  await _web.lists
                    .getByTitle("Instrumento")
                    .items.getById(_idInstrumento).update({
                      FilialId: filial,
                      StatusId: statusId,
                      Observacao: observacao
                    })
                    .then(async response => {

                      await _web.lists
                        .getByTitle("HistoricoInstrumento")
                        .items.add({
                          Title: cac,
                          StatusId: statusId,
                        })
                        .then(async response => {

                          console.log("gravou!!");
                          jQuery("#modalConfirmar").modal('hide');
                          jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });
                        })

                    })

                }

              }

            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR.responseText);
            }
          });


        }

      })
      .catch((error: any) => {
        console.log(error);

      })

  }


  protected carregaTecnicos() {

    //BDC_TECNICOS!A2|G501

    jQuery.ajax({
      url: `${this.props.siteurl}/_vti_bin/ExcelRest.aspx/Shared%20Documents/BDC_TECNICOS.xlsx/model/Ranges('BDC_TECNICOS!A2|G501')?$format=json&$top=5$orderby=NOME TEC`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      dataType: "json",
      async: false,
      success: function (data) {

        var arr = data;

        // console.log("arr", arr);

        var tamArray = arr.rows.length;

        for (var i = 0; i < tamArray; i++) {

          if (arr.rows[i][3].v != undefined) {

            _linha += `<tr class="gradeC" ><td>${arr.rows[i][0].v}</td><td>${arr.rows[i][2].v}</td><td>${arr.rows[i][3].v}</td><td>${arr.rows[i][4].v}</td><td>${arr.rows[i][5].v}</td><td>${arr.rows[i][6].v}</td><td><button data-dismiss="modal" onClick="
            (function(){ 
              $('#txtTecnico').val('${arr.rows[i][3].v}') 
              $('#txtTecnicoCodTecnico').val('${arr.rows[i][0].v}') 
              $('#txtTecnicoCodFilial').val('${arr.rows[i][2].v}')
              $('#txtTecnicoCargo').val('${arr.rows[i][4].v}')
              $('#txtTecnicoCodEmitente').val('${arr.rows[i][1].v}') 
              $('#txtTecnicoEstabelecimento').val('${arr.rows[i][6].v}')

            })();return false;"
            className="btn-info btn-sm border-0">Escolher</button></td></tr>`;

          }

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    //BDC_TECNICOS!A502|G1001

    jQuery.ajax({
      url: `${this.props.siteurl}/_vti_bin/ExcelRest.aspx/Shared%20Documents/BDC_TECNICOS.xlsx/model/Ranges('BDC_TECNICOS!A502|G1001')?$format=json&$top=5$orderby=NOME TEC`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      dataType: "json",
      async: false,
      success: function (data) {

        var arr = data;

        // console.log("arr", arr);

        var tamArray = arr.rows.length;

        for (var i = 0; i < tamArray; i++) {

          if (arr.rows[i][3].v != undefined) {

            _linha += `<tr class="gradeC" ><td>${arr.rows[i][0].v}</td><td>${arr.rows[i][2].v}</td><td>${arr.rows[i][3].v}</td><td>${arr.rows[i][4].v}</td><td>${arr.rows[i][5].v}</td><td>${arr.rows[i][6].v}</td><td><button data-dismiss="modal" onClick="
            (function(){ 
              $('#txtTecnico').val('${arr.rows[i][3].v}') 
              $('#txtTecnicoCodTecnico').val('${arr.rows[i][0].v}') 
              $('#txtTecnicoCodFilial').val('${arr.rows[i][2].v}')
              $('#txtTecnicoCargo').val('${arr.rows[i][4].v}')
              $('#txtTecnicoCodEmitente').val('${arr.rows[i][1].v}') 
              $('#txtTecnicoEstabelecimento').val('${arr.rows[i][6].v}')

            })();return false;"
            className="btn-info btn-sm border-0">Escolher</button></td></tr>`;

          }

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    //BDC_TECNICOS!A1002|G1501


    jQuery.ajax({
      url: `${this.props.siteurl}/_vti_bin/ExcelRest.aspx/Shared%20Documents/BDC_TECNICOS.xlsx/model/Ranges('BDC_TECNICOS!A1002|G1501')?$format=json&$top=5$orderby=NOME TEC`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      dataType: "json",
      async: false,
      success: function (data) {

        var arr = data;

        // console.log("arr", arr);

        var tamArray = arr.rows.length;

        for (var i = 0; i < tamArray; i++) {

          if (arr.rows[i][3].v != undefined) {

            _linha += `<tr class="gradeC" ><td>${arr.rows[i][0].v}</td><td>${arr.rows[i][2].v}</td><td>${arr.rows[i][3].v}</td><td>${arr.rows[i][4].v}</td><td>${arr.rows[i][5].v}</td><td>${arr.rows[i][6].v}</td><td><button data-dismiss="modal" onClick="
            (function(){ 
              $('#txtTecnico').val('${arr.rows[i][3].v}') 
              $('#txtTecnicoCodTecnico').val('${arr.rows[i][0].v}') 
              $('#txtTecnicoCodFilial').val('${arr.rows[i][2].v}')
              $('#txtTecnicoCargo').val('${arr.rows[i][4].v}')
              $('#txtTecnicoCodEmitente').val('${arr.rows[i][1].v}') 
              $('#txtTecnicoEstabelecimento').val('${arr.rows[i][6].v}')

            })();return false;"
            className="btn-info btn-sm border-0">Escolher</button></td></tr>`;

          }

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    //BDC_TECNICOS!A1502|G2001



    jQuery.ajax({
      url: `${this.props.siteurl}/_vti_bin/ExcelRest.aspx/Shared%20Documents/BDC_TECNICOS.xlsx/model/Ranges('BDC_TECNICOS!A1502|G2001')?$format=json&$top=5$orderby=NOME TEC`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      dataType: "json",
      async: false,
      success: function (data) {

        var arr = data;

        // console.log("arr", arr);

        var tamArray = arr.rows.length;

        for (var i = 0; i < tamArray; i++) {

          if (arr.rows[i][3].v != undefined) {

            _linha += `<tr class="gradeC" ><td>${arr.rows[i][0].v}</td><td>${arr.rows[i][2].v}</td><td>${arr.rows[i][3].v}</td><td>${arr.rows[i][4].v}</td><td>${arr.rows[i][5].v}</td><td>${arr.rows[i][6].v}</td><td><button data-dismiss="modal" onClick="
            (function(){ 
              $('#txtTecnico').val('${arr.rows[i][3].v}') 
              $('#txtTecnicoCodTecnico').val('${arr.rows[i][0].v}') 
              $('#txtTecnicoCodFilial').val('${arr.rows[i][2].v}')
              $('#txtTecnicoCargo').val('${arr.rows[i][4].v}')
              $('#txtTecnicoCodEmitente').val('${arr.rows[i][1].v}') 
              $('#txtTecnicoEstabelecimento').val('${arr.rows[i][6].v}')

            })();return false;"
            className="btn-info btn-sm border-0">Escolher</button></td></tr>`;

          }

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    //BDC_TECNICOS!A2002|G2501


    jQuery.ajax({
      url: `${this.props.siteurl}/_vti_bin/ExcelRest.aspx/Shared%20Documents/BDC_TECNICOS.xlsx/model/Ranges('BDC_TECNICOS!A2002|G2501')?$format=json&$top=5$orderby=NOME TEC`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      dataType: "json",
      async: false,
      success: function (data) {

        var arr = data;

        // console.log("arr", arr);

        var tamArray = arr.rows.length;

        for (var i = 0; i < tamArray; i++) {

          if (arr.rows[i][3].v != undefined) {

            _linha += `<tr class="gradeC" ><td>${arr.rows[i][0].v}</td><td>${arr.rows[i][2].v}</td><td>${arr.rows[i][3].v}</td><td>${arr.rows[i][4].v}</td><td>${arr.rows[i][5].v}</td><td>${arr.rows[i][6].v}</td><td><button data-dismiss="modal" onClick="
            (function(){ 
              $('#txtTecnico').val('${arr.rows[i][3].v}') 
              $('#txtTecnicoCodTecnico').val('${arr.rows[i][0].v}') 
              $('#txtTecnicoCodFilial').val('${arr.rows[i][2].v}')
              $('#txtTecnicoCargo').val('${arr.rows[i][4].v}')
              $('#txtTecnicoCodEmitente').val('${arr.rows[i][1].v}') 
              $('#txtTecnicoEstabelecimento').val('${arr.rows[i][6].v}')

            })();return false;"
            className="btn-info btn-sm border-0">Escolher</button></td></tr>`;

          }

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    //BDC_TECNICOS!A2502|G3001


    jQuery.ajax({
      url: `${this.props.siteurl}/_vti_bin/ExcelRest.aspx/Shared%20Documents/BDC_TECNICOS.xlsx/model/Ranges('BDC_TECNICOS!A2502|G3001')?$format=json&$top=5$orderby=NOME TEC`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      dataType: "json",
      async: false,
      success: function (data) {

        var arr = data;

        // console.log("arr", arr);

        var tamArray = arr.rows.length;

        for (var i = 0; i < tamArray; i++) {

          if (arr.rows[i][3].v != undefined) {

            _linha += `<tr class="gradeC" ><td>${arr.rows[i][0].v}</td><td>${arr.rows[i][2].v}</td><td>${arr.rows[i][3].v}</td><td>${arr.rows[i][4].v}</td><td>${arr.rows[i][5].v}</td><td>${arr.rows[i][6].v}</td><td><button data-dismiss="modal" onClick="
            (function(){ 
              $('#txtTecnico').val('${arr.rows[i][3].v}') 
              $('#txtTecnicoCodTecnico').val('${arr.rows[i][0].v}') 
              $('#txtTecnicoCodFilial').val('${arr.rows[i][2].v}')
              $('#txtTecnicoCargo').val('${arr.rows[i][4].v}')
              $('#txtTecnicoCodEmitente').val('${arr.rows[i][1].v}') 
              $('#txtTecnicoEstabelecimento').val('${arr.rows[i][6].v}')

            })();return false;"
            className="btn-info btn-sm border-0">Escolher</button></td></tr>`;

          }

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    //BDC_TECNICOS!A3002|G3501


    jQuery.ajax({
      url: `${this.props.siteurl}/_vti_bin/ExcelRest.aspx/Shared%20Documents/BDC_TECNICOS.xlsx/model/Ranges('BDC_TECNICOS!A3002|G3501')?$format=json&$top=5$orderby=NOME TEC`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      dataType: "json",
      async: false,
      success: function (data) {

        var arr = data;

        //  console.log("arr", arr);

        var tamArray = arr.rows.length;

        for (var i = 0; i < tamArray; i++) {

          if (arr.rows[i][3].v != undefined) {

            _linha += `<tr class="gradeC" ><td>${arr.rows[i][0].v}</td><td>${arr.rows[i][2].v}</td><td>${arr.rows[i][3].v}</td><td>${arr.rows[i][4].v}</td><td>${arr.rows[i][5].v}</td><td>${arr.rows[i][6].v}</td><td><button data-dismiss="modal" onClick="
                (function(){ 
                  $('#txtTecnico').val('${arr.rows[i][3].v}') 
                  $('#txtTecnicoCodTecnico').val('${arr.rows[i][0].v}') 
                  $('#txtTecnicoCodFilial').val('${arr.rows[i][2].v}')
                  $('#txtTecnicoCargo').val('${arr.rows[i][4].v}')
                  $('#txtTecnicoCodEmitente').val('${arr.rows[i][1].v}') 
                  $('#txtTecnicoEstabelecimento').val('${arr.rows[i][6].v}')
    
                })();return false;"
                className="btn-info btn-sm border-0">Escolher</button></td></tr>`;

          }

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    //  console.log("linha", _linha);
    $("#conteudoCarregando").hide();
    $("#conteudo_grid").show();

    jQuery("#conteudoTabela").append(_linha);


  }

  protected fecharSucesso() {

    jQuery("#modalSucesso").modal('hide');
    window.location.href = `Nova-ocorrencia.aspx`;

  }

}
