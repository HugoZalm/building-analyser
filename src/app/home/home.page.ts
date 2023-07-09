import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Viewer, Label, Ion, createOsmBuildingsAsync, Cartesian3, Math as CesiumMath, Terrain, Color, ScreenSpaceEventHandler, Cesium3DTileFeature, ScreenSpaceEventType } from 'cesium';
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
      const osmBuildingsTileset = await createOsmBuildingsAsync();
      this.viewer.scene.primitives.add(osmBuildingsTileset);
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
        highlighted.feature = pickedFeature;
        Color.clone(
          pickedFeature.color,
          highlighted.originalColor
        );
        pickedFeature.color = Color.YELLOW;
        this.changeInfo(pickedFeature);
      }
    },
    ScreenSpaceEventType.LEFT_CLICK);
  }

  private changeInfo(pickedFeature: Cesium3DTileFeature) {
    pickedFeature.getPropertyIds().forEach(id => console.log(id + ": " + pickedFeature.getProperty(id)));
  }
}


