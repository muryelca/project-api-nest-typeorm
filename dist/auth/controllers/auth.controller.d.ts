import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(user: User): Observable<User>;
    login(user: User): Observable<{
        token: string;
    }>;
}
