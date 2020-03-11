import 'module-alias/register';
import { Server } from '@/Units/Core/Express/Server';

new Server().configure().start();
