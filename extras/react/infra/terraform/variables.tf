variable "aws_region" {
  default = "us-east-1"
}

variable "domain_name" {
  description = "Domain for the React app"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for the React app"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name for the React build"
  type        = string
}

variable "tags" {
  type    = map(string)
}
