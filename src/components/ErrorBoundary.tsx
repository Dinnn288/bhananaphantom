import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0A0A0A] flex items-center justify-center p-6 text-white font-sans select-none">
          <div className="max-w-lg w-full bg-[#121217] border-4 border-[#FF0033] p-8 rounded-xl shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-4 bg-red-950/80 rounded-full border-2 border-[#FF0033] mb-4">
                <ShieldAlert className="w-12 h-12 text-[#FF0033] animate-pulse" />
              </div>

              <div className="bg-[#FF0033] text-black font-black px-4 py-1 text-sm skew-x-[-12deg] mb-2 uppercase italic">
                SISTEM PEMULIHAN DIMENSI GHAIB
              </div>

              <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider mb-2">
                ANOMALI GELOMBANG TERDETEKSI
              </h2>

              <p className="text-neutral-300 text-xs sm:text-sm font-mono mb-6 leading-relaxed">
                Terjadi ketidakstabilan dimensi pada animasi visual. Klik tombol di bawah untuk menyegarkan dan memulihkan kembali ke koridor sekolah dengan aman.
              </p>

              <button
                onClick={this.handleReset}
                className="bg-[#FF0033] hover:bg-white text-black font-bebas text-xl px-8 py-3 skew-x-[-12deg] border-2 border-black font-black flex items-center gap-2 cursor-pointer shadow-xl transition-all"
              >
                <RotateCw className="w-5 h-5 transform skew-x-[12deg]" />
                <span className="transform skew-x-[12deg]">PULIHKAN PERMAINAN</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
