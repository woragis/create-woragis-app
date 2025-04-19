module "static_site" {
  source = "git::https://github.com/woragis/terraform-static.git//?ref=v1"

  aws_region  = var.aws_region
  domain_name = var.domain_name
  subdomain   = var.subdomain
  bucket_name = var.bucket_name
  tags        = var.tags
}