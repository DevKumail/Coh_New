  import { provideHttpClient, withInterceptors } from '@angular/common/http';
  import { provideRouter } from '@angular/router';
  import { routes } from './app/app.routes';
  import { bootstrapApplication } from '@angular/platform-browser';
  import { importProvidersFrom } from '@angular/core';
  import { AppComponent } from './app/app.component';
  import { provideAnimations } from '@angular/platform-browser/animations';
  //import { LucideAngularModule } from 'node_modules/lucide-angular/lib/lucide-angular.module';
  import { LucideAngularModule } from 'lucide-angular';

  //import { User, Hospital, HeartPulse } from 'lucide-angular';
   import { User, Hospital, HeartPulse, ClipboardEdit, AlertCircle, CheckCircle  } from 'lucide-angular';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';

// const warn = console.warn;
// console.warn = (...args) => {
//   if (typeof args[0] === 'string' && args[0].includes('[Violation]')) {
//     return; // Ignore violation logs
//   }
//   warn(...args);
// };

    bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(),
      provideRouter(routes),
      provideAnimations(), 
       importProvidersFrom(
      LucideAngularModule.pick({
        User,
        Hospital,
        HeartPulse,
        ClipboardEdit,
        AlertCircle,
        CheckCircle
      })),
          provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    ]
  }).catch((err) => console.error(err));
