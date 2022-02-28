import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './user/user.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { WalletComponent } from './wallet/wallet.component';
import { QrComponent } from './qr/qr.component';
import { WardrobeComponent } from './wardrobe/wardrobe.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { TrendingComponent } from './trending/trending.component';
import { ExploreComponent } from './explore/explore.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    SidenavComponent,
    UserComponent,
    UserInfoComponent,
    WalletComponent,
    QrComponent,
    WardrobeComponent,
    MarketplaceComponent,
    TrendingComponent,
    ExploreComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
