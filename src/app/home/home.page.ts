import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Viewer, Label, SceneMode } from 'cesium';

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
    // const element = this.cesiumViewer.nativeElement;
    setTimeout(() => {
      this.viewer = this.createViewer('cesiumViewer');
    }, 10);
  }

  private createViewer(element: string) { // HTMLDivElement): Viewer {
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
      sceneMode: SceneMode.SCENE2D,
      shadows: false,
      orderIndependentTranslucency: false
    });
  }

}


