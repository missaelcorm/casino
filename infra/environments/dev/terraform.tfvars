aws_region         = "us-east-1"
project            = "friocasino"
environment        = "dev"
cloudflare_zone_id = "66c3a47d7eb630244d3e6f3e60f374b5" # Get this from Cloudflare dashboard
root_domain        = "missael.xyz"                      # Your domain name in Cloudflare

vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b"]

frontend_image = {
  repository_url = "missaelcorm/friocasino-web"
  tag            = "latest"
}

backend_image = {
  repository_url = "missaelcorm/friocasino-api"
  tag            = "latest"
}