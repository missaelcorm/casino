# Módulo de Monitoring - CloudWatch Dashboard

Este módulo crea un dashboard de CloudWatch con **métricas automáticas** que no requieren modificar el código de la aplicación.

## 📊 Métricas Incluidas

### 1. **Latencia de Respuesta (ALB)**
- **Fuente:** Application Load Balancer
- **Métricas:**
  - `TargetResponseTime` (Average) - Latencia promedio
  - `TargetResponseTime` (p99) - Latencia percentil 99
- **Qué mide:** Tiempo que tarda tu backend/frontend en responder a las peticiones
- **Útil para:** Detectar degradación de performance

### 2. **Volumen de Tráfico**
- **Fuente:** Application Load Balancer
- **Métrica:** `RequestCount` (Sum)
- **Qué mide:** Número total de requests por minuto
- **Útil para:** Entender patrones de uso, detectar picos de tráfico

### 3. **Tasa de Errores HTTP**
- **Fuente:** Application Load Balancer
- **Métricas:**
  - `HTTPCode_Target_5XX_Count` - Errores del backend
  - `HTTPCode_Target_4XX_Count` - Errores del cliente
  - `HTTPCode_ELB_5XX_Count` - Errores del load balancer
- **Qué mide:** Cantidad de errores HTTP
- **Útil para:** Detectar problemas en la aplicación o infraestructura

### 4. **Uso de Recursos (ECS Container Insights)**
- **Fuente:** Container Insights (ya habilitado)
- **Métricas:**
  - `CpuUtilized` - CPU utilizado
  - `MemoryUtilized` - Memoria utilizada
- **Qué mide:** Consumo de recursos de tus contenedores
- **Útil para:** Optimizar costos, planificar escalamiento

### 5. **Lambda de Pagos - Rendimiento**
- **Fuente:** AWS Lambda (automático)
- **Métricas:**
  - `Duration` (Average) - Duración promedio
  - `Errors` (Sum) - Número de errores
  - `Invocations` (Sum) - Número de invocaciones
- **Qué mide:** Performance y errores de la función de pagos
- **Útil para:** Monitorear transacciones críticas

### BONUS: Métricas Adicionales

#### **Estado de Salud de Servicios**
- `HealthyHostCount` - Instancias saludables
- `UnHealthyHostCount` - Instancias con problemas
- Para backend y frontend

#### **DocumentDB**
- `DatabaseConnections` - Conexiones activas
- `CPUUtilization` - CPU de la base de datos

#### **Análisis de Logs ECS**
- Query automático de errores en logs

## 🚀 Despliegue

### 1. Aplicar Terraform

```bash
cd infra/environments/dev
terraform init
terraform plan
terraform apply
```

### 2. Acceder al Dashboard

Después del despliegue, obtendrás la URL del dashboard:

```bash
terraform output monitoring_dashboard_url
```

O accede directamente desde la consola de AWS:
```
CloudWatch → Dashboards → friocasino-dev-metrics
```

## 💰 Costos

| Servicio | Costo Estimado |
|----------|----------------|
| CloudWatch Dashboard | $3/mes por dashboard |
| Container Insights | ~$5-10/mes |
| CloudWatch Logs | ~$0.50/GB ingested |
| Métricas estándar (ALB, Lambda, etc.) | **Gratis** |
| **Total estimado** | **~$10-15/mes** |

## 🔧 Personalización

### Cambiar periodo de retención

Edita el archivo de variables:

```hcl
# En main.tf del módulo de monitoring
retention_in_days = 7  # Cambiar de 30 a 7 días para reducir costos
```

### Agregar alertas SNS

Puedes conectar las alarmas existentes a SNS para recibir notificaciones:

```hcl
# En el módulo de ALB
alarm_actions = [aws_sns_topic.alerts.arn]
```

## 📈 Visualización en Desarrollo Local

En desarrollo local, estas métricas **NO** se generan porque:
- No hay ALB
- No hay ECS en AWS
- No hay Lambda en AWS

**Solución:** Las métricas solo aplican en AWS. En local, usa los logs de Docker:

```bash
docker-compose logs -f friocasino-api
docker-compose logs -f friocasino-web
```

## 🎯 Próximos Pasos (Opcional)

Si quieres métricas más avanzadas:

1. **Métricas Custom**: Agregar métricas de negocio desde el código
2. **X-Ray**: Distributed tracing para debugging profundo
3. **CloudWatch RUM**: Real User Monitoring para frontend
4. **CloudWatch Synthetics**: Canaries para monitoreo proactivo

## 🔍 Troubleshooting

### No veo datos en el dashboard

1. **Verifica que los servicios estén corriendo:**
   ```bash
   aws ecs list-services --cluster friocasino-dev-cluster
   ```

2. **Verifica que Container Insights esté habilitado:**
   ```bash
   aws ecs describe-clusters --clusters friocasino-dev-cluster --include SETTINGS
   ```

3. **Espera unos minutos:** Las métricas pueden tardar 5-10 minutos en aparecer

### Error: "No data available"

- Asegúrate de que hay tráfico real a tu aplicación
- Verifica que los target groups tengan instancias healthy
- Revisa que la región en el dashboard sea la correcta

## 📚 Referencias

- [CloudWatch Metrics for ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html)
- [Container Insights Metrics](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html)
- [Lambda Metrics](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html)
