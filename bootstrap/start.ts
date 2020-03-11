import 'module-alias/register';
import { Server } from '@/Units/Core/Express/Server';

// prettier-ignore
new Server()
    .configure()
    .start();
