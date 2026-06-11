-- ClinicHub — Schema Supabase
-- Cole este SQL no SQL Editor do Supabase Dashboard

-- Perfis de usuario (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text not null,
  email text not null,
  telefone text,
  tipo text not null default 'profissional' check (tipo in ('profissional', 'clinica', 'admin')),
  especialidade text,
  crm text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Perfil publico leitura" on public.profiles
  for select using (true);

create policy "Usuario edita proprio perfil" on public.profiles
  for update using (auth.uid() = id);

create policy "Insert proprio perfil" on public.profiles
  for insert with check (auth.uid() = id);

-- Trigger para criar perfil automaticamente no signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, email, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'tipo', 'profissional')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Salas
create table public.salas (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  tipo text not null default 'Consultorio',
  andar text,
  preco_hora numeric(10,2) not null,
  status text not null default 'Disponivel' check (status in ('Disponivel', 'Ocupada', 'Manutencao')),
  equipamentos text[] default '{}',
  foto_url text,
  created_at timestamptz default now()
);

alter table public.salas enable row level security;

create policy "Salas visiveis para todos" on public.salas
  for select using (true);

create policy "Admin gerencia salas" on public.salas
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo = 'admin')
  );

-- Reservas
create table public.reservas (
  id uuid default gen_random_uuid() primary key,
  sala_id uuid references public.salas on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  data date not null,
  hora_inicio time not null,
  hora_fim time not null,
  valor numeric(10,2) not null,
  status text not null default 'Pendente' check (status in ('Pendente', 'Confirmada', 'Cancelada', 'Concluida')),
  notas text,
  created_at timestamptz default now()
);

alter table public.reservas enable row level security;

create policy "Usuario ve proprias reservas" on public.reservas
  for select using (auth.uid() = user_id);

create policy "Admin ve todas reservas" on public.reservas
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo = 'admin')
  );

create policy "Usuario cria reserva" on public.reservas
  for insert with check (auth.uid() = user_id);

create policy "Admin gerencia reservas" on public.reservas
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo = 'admin')
  );

-- Produtos (e-commerce)
create table public.produtos (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  nome text not null,
  descricao text,
  categoria text not null,
  preco numeric(10,2) not null,
  preco_antigo numeric(10,2),
  estoque integer not null default 0,
  foto_url text,
  badge text,
  specs jsonb default '[]',
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table public.produtos enable row level security;

create policy "Produtos visiveis para todos" on public.produtos
  for select using (ativo = true);

create policy "Admin gerencia produtos" on public.produtos
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo = 'admin')
  );

-- Pedidos
create table public.pedidos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  itens jsonb not null default '[]',
  subtotal numeric(10,2) not null,
  frete numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'Pendente' check (status in ('Pendente', 'Pago', 'Em transito', 'Entregue', 'Cancelado')),
  rastreio text,
  created_at timestamptz default now()
);

alter table public.pedidos enable row level security;

create policy "Usuario ve proprios pedidos" on public.pedidos
  for select using (auth.uid() = user_id);

create policy "Usuario cria pedido" on public.pedidos
  for insert with check (auth.uid() = user_id);

create policy "Admin gerencia pedidos" on public.pedidos
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo = 'admin')
  );
