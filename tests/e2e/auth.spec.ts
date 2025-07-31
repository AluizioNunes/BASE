import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve mostrar página inicial', async ({ page }) => {
    await expect(page).toHaveTitle(/BASE/);
  });

  test('deve navegar para página de login', async ({ page }) => {
    // Simula clique no botão de login (ajuste conforme sua UI)
    await page.click('text=Login');
    
    // Verifica se está na página de login
    await expect(page).toHaveURL(/.*login/);
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    // Navega para login
    await page.goto('/login');
    
    // Preenche formulário com dados inválidos
    await page.fill('input[name="email"]', 'teste@invalido.com');
    await page.fill('input[name="password"]', 'senhaerrada');
    
    // Submete formulário
    await page.click('button[type="submit"]');
    
    // Verifica se aparece mensagem de erro
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('deve fazer login com credenciais válidas', async ({ page }) => {
    // Navega para login
    await page.goto('/login');
    
    // Preenche formulário com dados válidos
    await page.fill('input[name="email"]', 'usuario@exemplo.com');
    await page.fill('input[name="password"]', 'senha123');
    
    // Submete formulário
    await page.click('button[type="submit"]');
    
    // Verifica se foi redirecionado para dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verifica se mostra informações do usuário
    await expect(page.locator('.user-info')).toBeVisible();
  });

  test('deve fazer logout', async ({ page }) => {
    // Primeiro faz login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'usuario@exemplo.com');
    await page.fill('input[name="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    // Aguarda redirecionamento
    await page.waitForURL(/.*dashboard/);
    
    // Clica no botão de logout
    await page.click('.logout-button');
    
    // Verifica se foi redirecionado para login
    await expect(page).toHaveURL(/.*login/);
  });

  test('deve proteger rotas autenticadas', async ({ page }) => {
    // Tenta acessar rota protegida sem estar logado
    await page.goto('/dashboard');
    
    // Verifica se foi redirecionado para login
    await expect(page).toHaveURL(/.*login/);
  });
}); 