import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Viewer, Label, Ion, createOsmBuildingsAsync, Cartesian3, Math as CesiumMath, Terrain, Color, ScreenSpaceEventHandler, Cesium3DTileFeature, ScreenSpaceEventType, Cesium3DTileStyle } from 'cesium';
import { environment } from 'src/environments/environment';

export enum CellType {
  Label,
  Value,
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {
  @ViewChild('cesiumViewer')
  cesiumViewer!: ElementRef<HTMLDivElement>;

  private infobox!: HTMLDivElement;

  /**
   * The main {Cesium.Viewer}
   */
  private viewer!: Viewer;

  private selected = {
    feature: undefined,
    originalColor: new Color(),
  };

  constructor() {}

  ngAfterViewInit(): void {
    const element = this.cesiumViewer.nativeElement;
    if (environment.cesiumAccessToken) {
      Ion.defaultAccessToken = environment.cesiumAccessToken;
    }
    setTimeout(async () => {
      this.viewer = this.createViewer(element);
      this.createInfobox();
      const osmBuildingsTileset = await createOsmBuildingsAsync();
      this.viewer.scene.primitives.add(osmBuildingsTileset);
      osmBuildingsTileset.style = new Cesium3DTileStyle({
        defines: {
          name: "${feature['name']}",
        },
        color: {
          conditions: [
            // ["${material} === null", "color('white')"],
            // ["${material} === 'glass'", "color('skyblue', 0.5)"],
            // ["${material} === 'concrete'", "color('grey')"],
            // ["${material} === 'brick'", "color('indianred')"],
            // ["${material} === 'stone'", "color('lightslategrey')"],
            // ["${material} === 'metal'", "color('lightgrey')"],
            // ["${material} === 'steel'", "color('lightsteelblue')"],
            ["${name} !== undefined", "color('lightsteelblue')"],
            ["true", "color('white')"], // This is the else case
          ],
        },
      });
          this.viewer.scene.camera.flyTo({
        destination: Cartesian3.fromDegrees(5.526, 51.765, 250),
        orientation: {
          heading: CesiumMath.toRadians(20),
          pitch: CesiumMath.toRadians(-20),
        },
      });
      this.setHandlers();
    }, 10);
  }

  private createInfobox() {
    this.infobox = document.createElement('div')
    this.infobox.id = 'infobox';
    this.infobox.style.cssText = `
      min-height: 30px;
      display: inline-block;
      background-color: white;
      position: relative;
      vertical-align: top;
      border-radius: 3px;
      margin: 3px;
    `;
    const cesiumToolbar = document.getElementsByClassName('cesium-viewer-toolbar')[0];
    cesiumToolbar.prepend(this.infobox);

  }

  private createViewer(element: HTMLDivElement): Viewer {
    Label.enableRightToLeftDetection = true;
    return new Viewer(element, {
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: true,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      // imageryProvider: null,
      baseLayerPicker: true,
      animation: false,
      selectionIndicator: false,
      projectionPicker: false,
      // sceneMode: SceneMode.SCENE2D,
      shadows: false,
      orderIndependentTranslucency: false,
      terrain: Terrain.fromWorldTerrain(),
    });
  }

  private setHandlers() {
    const highlighted: {
      feature: Cesium3DTileFeature | undefined,
      originalColor: Color,
    } = {
      feature: undefined,
      originalColor: new Color(),
    };
  
    // Color a feature yellow on hover.
    this.viewer.screenSpaceEventHandler.setInputAction(
      (movement: ScreenSpaceEventHandler.PositionedEvent) => {
      // If a feature was previously highlighted, undo the highlight
      if (highlighted.feature !== undefined) {
        highlighted.feature.color = highlighted.originalColor;
        highlighted.feature = undefined;
      }
      // Pick a new feature
      const pickedFeature = this.viewer.scene.pick(movement.position);
  
      // Highlight the feature if it's not already selected.
      if (pickedFeature !== this.selected.feature) {
        this.selected.feature = pickedFeature;
        if (pickedFeature !== undefined) {
          highlighted.feature = pickedFeature;
          Color.clone(
            pickedFeature.color,
            highlighted.originalColor
          );
          pickedFeature.color = Color.YELLOW;
          this.changeInfo(pickedFeature);
        } else {
          this.infobox.innerHTML = '';
        }
      }
    },
    ScreenSpaceEventType.LEFT_CLICK);
  }

  private changeInfo(pickedFeature: Cesium3DTileFeature) {
    pickedFeature.getPropertyIds().forEach(id => console.log(id + ": " + pickedFeature.getProperty(id)));
    this.infobox.innerHTML =
      '<div style="padding:3px">' +
      this.createRow('bagid', this.getProperty(pickedFeature, 'ref:bag')) + 
      this.createRow('naam', this.getProperty(pickedFeature, 'name')) +
      '</div>'
    }

  private getProperty(feature: Cesium3DTileFeature, propertyName: string): string {
    const propertyValue = feature.getProperty(propertyName) !== undefined
        ? feature.getProperty(propertyName)
        : '';
    return propertyValue;
  }

  private createRow(label: string, value: string): string {
    if ( value === '') {
      return value;
    }
    const l =
      '<span '
      + 'style="'
      + 'display: table-cell;'
      + 'width: 50px;'
      + 'margin: 0px 2px;'
      + '">'
      + label
      + '</span>';
      const v =
      '<span '
      + 'style="'
      + 'display: table-cell;'
      + 'width: 150px;'
      + 'margin: 0px 2px;'
      + '">'
      + value
      + '</span>';
    return '<span style="display: table-row">' + l + v + '</span>';
  }
}


