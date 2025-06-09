Write-Host "Testando callback do LovelyApp..." -ForegroundColor Yellow

try {
    # Fazer login
    Write-Host "Fazendo login..." -ForegroundColor Cyan
    $loginData = @{
        email = "teste@lovelyapp.com"
        password = "123456"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://192.168.100.18:3333/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    
    if ($loginResponse.success) {
        Write-Host "Login realizado com sucesso!" -ForegroundColor Green
        Write-Host "URL de callback: $($loginResponse.data.redirectUrl)" -ForegroundColor Cyan
        
        # Extrair token da URL
        $url = $loginResponse.data.redirectUrl
        if ($url -match "token=([^&]+)") {
            $token = $matches[1]
            Write-Host "Token extraido: $($token.Substring(0, 50))..." -ForegroundColor Yellow
        }
        
        # Extrair dados do usuário
        if ($url -match "user=([^&]+)") {
            $userEncoded = $matches[1]
            $userDecoded = [System.Web.HttpUtility]::UrlDecode($userEncoded)
            Write-Host "Dados do usuario: $userDecoded" -ForegroundColor Magenta
        }
        
        # Testar acesso ao callback
        Write-Host "Testando acesso ao callback..." -ForegroundColor Cyan
        $callbackResponse = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
        Write-Host "Status do callback: $($callbackResponse.StatusCode)" -ForegroundColor Green
        
    } else {
        Write-Host "Falha no login: $($loginResponse.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Teste concluido!" -ForegroundColor Green 