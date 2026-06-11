export function Footer() {
  return (
    <footer className="bg-dark text-slate-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-xs">
                CH
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Clinic<span className="text-primary-light">Hub</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              A plataforma #1 de aluguel de salas medicas do Brasil.
            </p>
            <div className="flex gap-3">
              {["instagram", "facebook", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-white/5 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary-light transition-colors">Buscar Salas</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Pacotes</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">E-Commerce</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Para Clinicas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Empresa
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary-light transition-colors">Sobre Nos</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Suporte
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary-light transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 ClinicHub. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{" "}
            <a href="#" className="text-primary-light hover:text-primary font-medium">
              FJN Tecnologia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
