module "cognito" {
  source = "git::https://github.com/woragis/terraform-cognito.git//?ref=v1"

  aws_region     = var.aws_region
  user_pool_name = var.user_pool_name
}
