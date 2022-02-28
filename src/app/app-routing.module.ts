import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrComponent } from './qr/qr.component';
import { ExploreComponent } from './explore/explore.component';
import { ListComponent } from './list/list.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { TrendingComponent } from './trending/trending.component';
import { WardrobeComponent } from './wardrobe/wardrobe.component';


const routes: Routes = [
  { path: '', redirectTo: 'wardrobe', pathMatch: 'full' },
  { path: 'qr-code', component: QrComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'list-collection', component: ListComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'my-wardrobe', component: WardrobeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}