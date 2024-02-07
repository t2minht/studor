import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Landing } from 'app/Landing.jsx';

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = createRouteHandlerClient({ cookies });
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(requestUrl.origin);
}


export const route = () => {
    return (
        <Router>
            <Switch>
                <Route path = "/">
                    <Landing />
                </Route>
            </Switch>
        </Router>
    )
}
