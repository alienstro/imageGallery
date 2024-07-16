import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base'
import { AppModule } from './app/app.module';

registerLicense('ORg4AjUWIQA/Gnt2U1hhQlJBfVddXGdWfFN0QXNYfVRxdV9HZ0wxOX1dQl9nSXlSc0RhWHtecH1UQGc=')


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
