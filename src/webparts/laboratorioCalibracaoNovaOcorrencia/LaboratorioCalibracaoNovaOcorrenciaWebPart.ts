import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'LaboratorioCalibracaoNovaOcorrenciaWebPartStrings';
import LaboratorioCalibracaoNovaOcorrencia from './components/LaboratorioCalibracaoNovaOcorrencia';
import { ILaboratorioCalibracaoNovaOcorrenciaProps } from './components/ILaboratorioCalibracaoNovaOcorrenciaProps';

export interface ILaboratorioCalibracaoNovaOcorrenciaWebPartProps {
  description: string;
}

export default class LaboratorioCalibracaoNovaOcorrenciaWebPart extends BaseClientSideWebPart<ILaboratorioCalibracaoNovaOcorrenciaWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ILaboratorioCalibracaoNovaOcorrenciaProps> = React.createElement(
      LaboratorioCalibracaoNovaOcorrencia,
      {
        description: this.properties.description,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
      }
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
