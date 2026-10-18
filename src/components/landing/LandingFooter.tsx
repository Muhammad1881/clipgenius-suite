import { Link } from "@tanstack/react-router";
import { Scissors } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="pt-20 pb-10 px-6 border-t border-white/[0.07] bg-[#040508] relative" id="footer">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Col 1: Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] p-[1px]">
                <div className="w-full h-full bg-[#040508] rounded-xl flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-display font-bold text-xl text-white">Clipra</span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm mb-4 leading-relaxed">
              Turn long videos into scroll-stopping shorts with AI.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span>theclipra.com</span>
              <span>•</span>
              <span className="text-[#10B981]">System Live</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Sign up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tools</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/ai-clip-generator" className="hover:text-white transition-colors">
                  AI Clip Generator
                </Link>
              </li>
              <li>
                <Link to="/youtube-shorts-generator" className="hover:text-white transition-colors">
                  YouTube Shorts Generator
                </Link>
              </li>
              <li>
                <Link to="/podcast-clip-maker" className="hover:text-white transition-colors">
                  Podcast Clip Maker
                </Link>
              </li>
              <li>
                <Link to="/tiktok-clip-maker" className="hover:text-white transition-colors">
                  TikTok Clip Maker
                </Link>
              </li>
              <li>
                <Link to="/instagram-reels-maker" className="hover:text-white transition-colors">
                  Instagram Reels Maker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/blog/clipra-vs-opus-clip" className="hover:text-white transition-colors">
                  Clipra vs Opus Clip
                </Link>
              </li>
              <li>
                <Link to="/blog/best-ai-clip-generators-2026" className="hover:text-white transition-colors">
                  Best AI clip tools
                </Link>
              </li>
              <li>
                <Link to="/blog/how-to-repurpose-podcasts-into-shorts" className="hover:text-white transition-colors">
                  Podcast &rarr; Shorts guide
                </Link>
              </li>
            </ul>
            <h4 className="text-white font-semibold text-sm mt-6 mb-3">Company</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/trust" className="hover:text-white transition-colors">
                  Trust & Security
                </Link>
              </li>
              <li>
                <a href="mailto:support@theclipra.com" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-zinc-800 text-xs text-zinc-500 gap-4">
          <p>&copy; 2026 Clipra. Crafted for creators.</p>
          <div className="flex items-center gap-6">
            <Link to="/trust" className="hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link to="/trust" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
            <a href="https://theclipra.com" className="text-zinc-400 hover:text-white transition-colors">
              theclipra.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
