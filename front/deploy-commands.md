# Comandos de Deploy - Frontend

## 1. Clone do repositório na VPS
```bash
ssh root@31.97.15.106 "cd /var/www && rm -rf lovely-front && git clone https://github.com/volticscontent/lovely.git lovely-front"
```

## 2. Instalar dependências
```bash
ssh root@31.97.15.106 "cd /var/www/lovely-front && npm install --legacy-peer-deps"
```

## 3. Fazer build (se necessário)
```bash
ssh root@31.97.15.106 "cd /var/www/lovely-front && npm run build"
```

## 4. Configurar serviço systemd
```bash
ssh root@31.97.15.106 "cat > /etc/systemd/system/lovely-front.service << 'EOF'
[Unit]
Description=Lovely Frontend Next.js App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/lovely-front
Environment=NODE_ENV=production
Environment=PORT=3001
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF"
```

## 5. Iniciar serviço
```bash
ssh root@31.97.15.106 "systemctl daemon-reload && systemctl enable lovely-front && systemctl start lovely-front"
```

## 6. Verificar status
```bash
ssh root@31.97.15.106 "systemctl status lovely-front"
```

## 7. Testar aplicação
```bash
curl http://31.97.15.106:3001
```

## URLs de acesso
- Frontend: http://31.97.15.106:3001
- Backend: http://31.97.15.106:3000 (se já estiver rodando)

## Comandos úteis
- Ver logs: `ssh root@31.97.15.106 'journalctl -u lovely-front -f'`
- Reiniciar: `ssh root@31.97.15.106 'systemctl restart lovely-front'`
- Parar: `ssh root@31.97.15.106 'systemctl stop lovely-front'` 