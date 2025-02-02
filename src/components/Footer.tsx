import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t mt-auto">
            <div className="container mx-auto text-center text-muted-foreground">
                © 2024 Trip Together. All rights reserved.
                <br />
                <Link to="/privacy-policy" className="text-blue-500 hover:underline">
                    Privacy Policy
                </Link>
            </div>
        </footer>
    );
}