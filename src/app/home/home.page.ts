import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Viewer, Label, Ion, createOsmBuildingsAsync, Cartesian3, Math as CesiumMath, Terrain } from 'cesium';
import { environment } from 'src/environments/environment';

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

  /**
   * The main {Cesium.Viewer}
   */
  private viewer!: Viewer;
  constructor() {}

  ngAfterViewInit(): void {
    const element = this.cesiumViewer.nativeElement;
    if (environment.cesiumAccessToken) {
      Ion.defaultAccessToken = environment.cesiumAccessToken;
    }
    setTimeout(async () => {
      this.viewer = this.createViewer(element);
      const osmBuildingsTileset = await createOsmBuildingsAsync();
      this.viewer.scene.primitives.add(osmBuildingsTileset);
      this.viewer.scene.camera.flyTo({
        destination: Cartesian3.fromDegrees(5.526, 51.765, 250),
        orientation: {
          heading: CesiumMath.toRadians(20),
          pitch: CesiumMath.toRadians(-20),
        },
      }); 
    }, 10);
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
}


