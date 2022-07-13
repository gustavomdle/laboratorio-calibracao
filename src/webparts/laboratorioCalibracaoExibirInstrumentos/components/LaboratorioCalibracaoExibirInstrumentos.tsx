import * as React from 'react';
import styles from './LaboratorioCalibracaoExibirInstrumentos.module.scss';
import { ILaboratorioCalibracaoExibirInstrumentosProps } from './ILaboratorioCalibracaoExibirInstrumentosProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import BootstrapTable from 'react-bootstrap-table-next';

import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { selectFilter } from 'react-bootstrap-table2-filter';
import { numberFilter } from 'react-bootstrap-table2-filter';
import { Comparator } from 'react-bootstrap-table2-filter';
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _idInstrumento;

export interface IShowEmployeeStates {
  employeeList: any[]
}

const customFilter = textFilter({
  placeholder: ' ',  // custom the input placeholder
});

const empTablecolumns = [
  {
    dataField: "Title",
    text: "Nro",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Filial.Title",
    text: "Filial",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "FilialFinal.Title",
    text: "FilialFinal",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "TecInicial",
    text: "TecInicial",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "TecFinal",
    text: "TecFinal",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "StatusInicial.Title",
    text: "StatusInicial",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "StatusFinal.Title",
    text: "StatusFinal",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "nrCertificado",
    text: "nrCertificado",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Vencimento",
    text: "Vencimento",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter,
    formatter: (rowContent, row) => {
      var dataVencimento = new Date(row.Vencimento);
      var dtDataEntregaPropostaCliente = ("0" + dataVencimento.getDate()).slice(-2) + '/' + ("0" + (dataVencimento.getMonth() + 1)).slice(-2) + '/' + dataVencimento.getFullYear();
      if(dtDataEntregaPropostaCliente == "31/12/1969") dtDataEntregaPropostaCliente = ""
      return dtDataEntregaPropostaCliente;
    }
  },

]

const paginationOptions = {
  sizePerPage: 10,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};

export default class LaboratorioCalibracaoExibirInstrumentos extends React.Component<ILaboratorioCalibracaoExibirInstrumentosProps, IShowEmployeeStates> {

  constructor(props: ILaboratorioCalibracaoExibirInstrumentosProps) {
    super(props);
    this.state = {
      employeeList: []
    }
  }

  public async componentDidMount() {

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _idInstrumento = parseInt(queryParms.getValue("InstrumentoID"));

    this.getInstrumento();

  }



  public render(): React.ReactElement<ILaboratorioCalibracaoExibirInstrumentosProps> {
    
    return (


      <><div id="container">

        <div className="form-group">
          <div className="form-row ">
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtCAC">CAC</label><br></br>
              <span className="text-info" id='txtCAC'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtFabricante">Fabricante</label><br></br>
              <span className="text-info" id='txtFabricante'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtModelo">Modelo</label><br></br>
              <span className="text-info" id='txtModelo'></span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="form-row ">
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtResolucao">Resolução</label><br></br>
              <span className="text-info" id='txtResolucao'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtStatus">Status</label><br></br>
              <span className="text-info" id='txtStatus'></span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="form-row ">
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtDescricao">Descrição</label><br></br>
              <span className="text-info" id='txtDescricao'></span>
            </div>
          </div>
        </div>


        <div className="form-group">
          <div className="form-row ">
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtFilial">Filial</label><br></br>
              <span className="text-info" id='txtFilial'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtTecnico">Técnico</label><br></br>
              <span className="text-info" id='txtTecnico'></span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="form-row ">
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtNumeroDeSerie">Número de série</label><br></br>
              <span className="text-info" id='txtNumeroDeSerie'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtTipoDeInstrumento">Tipo de instrumento</label><br></br>
              <span className="text-info" id='txtTipoDeInstrumento'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtNroCertificado">Número do certificado</label><br></br>
              <span className="text-info" id='txtNroCertificado'></span>
            </div>

          </div>
        </div>

        <div className="form-group">
          <div className="form-row ">
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtStatusVencimento">Status vencimento</label><br></br>
              <span className="text-info" id='txtStatusVencimento'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtVencimento">Vencimento</label><br></br>
              <span className="text-info" id='txtVencimento'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtDataAfericao">Data aferição</label><br></br>
              <span className="text-info" id='txtDataAfericao'></span>
            </div>
            <div className="form-group col-md border m-1" style={{ "height": "53px" }}>
              <label htmlFor="txtDiasProxAfericao">Dias da próxima aferição</label><br></br>
              <span className="text-info" id='txtDiasProxAfericao'></span>
            </div>
          </div>
        </div>

        <p>Resultado: <span className="text-info" id="txtCountProposta"></span> proposta(s) encontrada(s)</p>
        <div className='conteudoTabela'>
        <BootstrapTable bootstrap4 condensed hover={true} className="gridOcorrenciaPorCAC" id="gridOcorrenciaPorCAC" keyField='id' data={this.state.employeeList} columns={empTablecolumns} headerClasses="header-class" pagination={paginationFactory(paginationOptions)} filter={filterFactory()} />
        </div>


      </div>
      
      <br></br><>
          <div className={styles.container}>
          </div></></>



    );
  }


  protected getInstrumento() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Instrumento')/items?$select=ID,Title,Fabricante/Title,Modelo,Resolucao,Status/Title,Descricao,Filial/Title,Tecnico,NumeroDeSerie,TipoDeInstrumento/Title,nrCertificado,Status_x0020_do_x0020_Vencimento,Vencimento,DataAfericao,DiasProximaAfericao&$expand=Status,Filial,Fabricante,TipoDeInstrumento&$filter=ID eq ` + _idInstrumento,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      async: false,
      success: async (resultData) => {

        //console.log("resultData Proposta", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var cac = resultData.d.results[i].Title;
            var fabricante = resultData.d.results[i].Fabricante.Title;
            var modelo = resultData.d.results[i].Modelo;
            var resolucao = resultData.d.results[i].Resolucao;
            var status = resultData.d.results[i].Status.Title;
            var descricao = resultData.d.results[i].Descricao;
            var filial = resultData.d.results[i].Filial.Title;
            var tecnico = resultData.d.results[i].Tecnico;
            var numeroDeSerie = resultData.d.results[i].NumeroDeSerie;
            var tipoDeInstrumento = resultData.d.results[i].TipoDeInstrumento;
            var nrCertificado = resultData.d.results[i].nrCertificado;
            var statusVencimento = resultData.d.results[i].Status_x0020_do_x0020_Vencimento;

            var vencimento = new Date(resultData.d.results[i].Vencimento);
            var dtvencimento = ("0" + vencimento.getDate()).slice(-2) + '/' + ("0" + (vencimento.getMonth() + 1)).slice(-2) + '/' + vencimento.getFullYear();
            // if (dtvencimento == "31/12/1969") dtvencimento = "";

            var dataAfericao = new Date(resultData.d.results[i].DataAfericao);
            var dtdataAfericao = ("0" + dataAfericao.getDate()).slice(-2) + '/' + ("0" + (dataAfericao.getMonth() + 1)).slice(-2) + '/' + dataAfericao.getFullYear();
            // if (dtdataAfericao == "31/12/1969") dtdataAfericao = "";

            var diasProximaAfericao = resultData.d.results[i].DiasProximaAfericao;

            jQuery("#txtCAC").html(cac);
            jQuery("#txtFabricante").html(fabricante);
            jQuery("#txtModelo").html(modelo);
            jQuery("#txtResolucao").html(resolucao);
            jQuery("#txtStatus").html(status);
            jQuery("#txtDescricao").html(descricao);
            jQuery("#txtFilial").html(filial);
            jQuery("#txtTecnico").html(tecnico);
            jQuery("#txtNumeroDeSerie").html(numeroDeSerie);
            jQuery("#txtTipoDeInstrumento").html(tipoDeInstrumento);
            jQuery("#txtNroCertificado").html(nrCertificado);
            jQuery("#txtStatusVencimento").html(statusVencimento);
            jQuery("#txtVencimento").html(dtvencimento);
            jQuery("#txtDataAfericao").html(dtdataAfericao);
            jQuery("#txtDiasProxAfericao").html(diasProximaAfericao);

          }

          this.getOcorrencia(cac);

        }



      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }



    })

  }


  protected getOcorrencia(cac){

    console.log("cac",cac);

    var reactHandler = this;

    jQuery.ajax({
      //url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ocorrencia')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Filial/Title,FilialFinal/Title,TecInicial,TecFinal,StatusInicial/Title,StatusFinal/Title,nrCertificado,Vencimento&$expand=Filial,FilialFinal,StatusInicial,StatusFinal&$filter=CAC eq '000000'`,
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ocorrencia')/items?$top=4999&$&$select=ID,Title,Filial/Title,FilialFinal/Title,TecInicial,TecFinal,StatusInicial/Title,StatusFinal/Title,nrCertificado,Vencimento&$expand=Filial,FilialFinal,StatusInicial,StatusFinal&$filter=CAC eq '${cac}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData3",resultData);
        jQuery('#txtCountProposta').html(resultData.d.results.length);
        reactHandler.setState({
          employeeList: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

  }
}
