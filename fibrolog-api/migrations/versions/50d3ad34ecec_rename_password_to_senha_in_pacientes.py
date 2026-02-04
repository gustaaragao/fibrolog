"""rename_password_to_senha_in_pacientes

Revision ID: 50d3ad34ecec
Revises: 0d7c49c38725
Create Date: 2026-02-04 11:36:54.886071

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '50d3ad34ecec'
down_revision: Union[str, Sequence[str], None] = '0d7c49c38725'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Renomear coluna password para senha na tabela pacientes
    op.alter_column('pacientes', 'password', new_column_name='senha')


def downgrade() -> None:
    """Downgrade schema."""
    # Reverter: renomear coluna senha de volta para password
    op.alter_column('pacientes', 'senha', new_column_name='password')
