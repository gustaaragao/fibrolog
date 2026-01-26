"""add default to created_at

Revision ID: 9cdcf4a9a285
Revises: 1735e4287e0d
Create Date: 2026-01-26 13:06:41.166926

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9cdcf4a9a285'
down_revision: Union[str, Sequence[str], None] = '1735e4287e0d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
