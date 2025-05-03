module "static_site" {
  source = "git::https://github.com/woragis/terraform-static.git//?ref=v1"

  project_name = var.project_name
  project_type = var.project_type
  aws_region   = var.aws_region
  domain_name  = var.domain_name
  subdomain    = var.subdomain
  bucket_name  = var.bucket_name != "null" ? var.bucket_name : "${var.project_name}-s3"  # Default bucket name if null
  create_zone  = var.create_zone
  tags         = var.tags
}
