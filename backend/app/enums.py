from enum import Enum


class DonationType(str, Enum):
    zakat = "zakat"
    sadaqah = "sadaqah"
    lillah = "lillah"
    zakat_al_fitr = "zakat_al_fitr"
    fidya = "fidya"
    kaffarah = "kaffarah"
    waqf = "waqf"
    general = "general"
    uncategorised = "uncategorised"


# These types must never be commingled with general income
RESTRICTED_TYPES: frozenset[DonationType] = frozenset({
    DonationType.zakat,
    DonationType.zakat_al_fitr,
    DonationType.fidya,
    DonationType.kaffarah,
    DonationType.waqf,
})


class SourceType(str, Enum):
    manual = "manual"
    bulk_import = "bulk_import"
