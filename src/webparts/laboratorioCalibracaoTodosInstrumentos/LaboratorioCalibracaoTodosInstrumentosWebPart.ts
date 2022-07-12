import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'LaboratorioCalibracaoTodosInstrumentosWebPartStrings';
import LaboratorioCalibracaoTodosInstrumentos from './components/LaboratorioCalibracaoTodosInstrumentos';
import { ILaboratorioCalibracaoTodosInstrumentosProps } from './components/ILaboratorioCalibracaoTodosInstrumentosProps';

export interface ILaboratorioCalibracaoTodosInstrumentosWebPartProps {
  description: string;
}

export default class LaboratorioCalibracaoTodosInstrumentosWebPart extends BaseClientSideWebPart<ILaboratorioCalibracaoTodosInstrumentosWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ILaboratorioCalibracaoTodosInstrumentosProps> = React.createElement(
      LaboratorioCalibracaoTodosInstrumentos,
      {
        description: this.properties.description,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
