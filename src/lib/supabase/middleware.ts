import { withAuth } from "next-auth/middleware"
export default withAuth()
export const config = { matcher: ["/dashboard/:path*", "/criancas/:path*", "/chamada/:path*", "/configuracoes/:path*"] }