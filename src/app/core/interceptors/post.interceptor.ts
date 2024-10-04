import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const postInterceptor: HttpInterceptorFn = (req, next) => {
  const url = `${environment.API}/${req.url}`
  const updateRequest = req.clone({
    url,
  })

  return next(updateRequest)
};
